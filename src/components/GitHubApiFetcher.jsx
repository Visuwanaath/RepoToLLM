import React, { useState } from 'react';
import axios from 'axios';
import { Button, Group, TextInput, Tree, Textarea, CopyButton, Notification, Stack, Checkbox, Text, Box, Title, useTree, Card, ScrollArea, Space } from '@mantine/core';
import renderTreeNode from './renderTreeNode';
const GitHubApiFetcher = ({ onFetchComplete }) => {
    const [repoLink, setRepoLink] = useState('');
    const [apiToken, setApiToken] = useState('');
    const [recursive, setRecursive] = useState(false);
    const [repoData, setRepoData] = useState(null);
    const [displayTreeData, setDisplayTreeData] = useState(null);
    const [pureTree, setPureTree] = useState(null);
    const [error, setError] = useState('');
    const [filesToDownload, setFilesToDownload] = useState([]);
    const [repoOwner, setRepoOwner] = useState('');
    const [repoName, setRepoName] = useState('');
    const [filesContent, setFilesContent] = useState([]);
    const [filesContentString, setFilesContentString] = useState('');
    const treeRef = useTree();

    const parseRepoLink = (link) => {
        const [owner, repo] = link.replace('https://github.com/', '').split('/');
        let posOfTreeConst = 'https://github.com/'.length + owner.length + repo.length + 2;
        link = link.slice(posOfTreeConst)
        if (link.startsWith('tree')) {
            link = link.slice(4)
            if (link.startsWith('/')) {
                link = link.slice(1)
            }
            let branch = link.split('/')[0]
            let path = link.slice(branch.length + 1)
            setRepoName(repo)
            setRepoOwner(owner)
            return { owner, repo, path };
        }
        setRepoName(repo)
        setRepoOwner(owner)
        return { owner, repo };
    };

    const getRepoContents = async (owner, repo, path = '') => {
        try {
            const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
            const headers = {};
            if (apiToken) {
                headers.Authorization = `token ${apiToken}`;
            }
            const response = await axios.get(url, { headers });
            return response.data;
        } catch (error) {
            console.error('Error fetching repository contents:', error);
            setError('Failed to fetch repository contents');
            throw error;
        }
    };

    const dataTreeToPureTree = (dataTree) => {
        let pureTreeStruc = []
        for (const item of dataTree) {
            if (item.fileOrDir === 'dir') {
                let children;
                if (item.children && item.children.length != 0) {
                    children = dataTreeToPureTree(item.children)
                }
                pureTreeStruc.push({ folderName: item.label, children })
            } else {
                pureTreeStruc.push({ fileName: item.label })
            }
        }
        return pureTreeStruc
    };
    const displayTreeDataConverter = (dataTree) => {
        let displayTree = []
        for (const item of dataTree) {
            if (item.fileOrDir === 'dir') {
                let children;
                if (item.children) {
                    children = displayTreeDataConverter(item.children)
                    displayTree.push({ label: item.label, value: item.value, children })
                }

            } else {
                displayTree.push({ label: item.label, value: item.value })
            }
        }
        return displayTree
    }
    const fetchRecursive = async (owner, repo, path = '') => {
        const contents = await getRepoContents(owner, repo, path);
        const tree = [];
        for (const item of contents) {
            if (item.type === 'dir' && recursive) {
                tree.push({ label: item.name, value: item.path, fileOrDir: "dir", children: await fetchRecursive(owner, repo, item.path) });
            } else if (item.type === 'file') {
                tree.push({ label: item.name, value: item.path, fileOrDir: "file" });
            } else {
                tree.push({ label: item.name, value: item.path, fileOrDir: "dir" });
            }
        }
        return tree;
    };
    const fetchFile = async (path) => {
        try {
            const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}`;
            const headers = {};
            if (apiToken) {
                headers.Authorization = `token ${apiToken}`;
            }
            const response = await axios.get(url, { headers });
            let fileContent = atob(response['data']['content']);
            if (fileContent) {
                return fileContent;
            }
            return null;

        } catch (error) {
            console.error('Error fetching repository contents:', error);
            setError('Failed to fetch repository contents');
            throw error;
        }
    }
    const fetchFilesData = async (updatedFilesToDownload) => {
        const filesDataPromises = updatedFilesToDownload.map(async (file) => {
            const fileContent = await fetchFile(file);
            return {
                name: file,
                data: fileContent
            };
        });
        const filesData = await Promise.all(filesDataPromises);
        return filesData;
    }
    const updateFilesToDownloadList = () => {
        const checkedFiles = [];
        const traverseTree = (nodes) => {
            for (const node of nodes) {
                if (treeRef.isNodeChecked(node.value) || treeRef.isNodeIndeterminate(node.value)) {
                    if (node.children) {
                        traverseTree(node.children);
                    } else {
                        checkedFiles.push(node.value);
                    }
                }
            }
        };
        traverseTree(displayTreeData);
        setFilesToDownload(checkedFiles);
        return checkedFiles
    }
    const titleFileContentHeader = "I have added some files to help you gain some context. Please review them before answering my prompt."
    const handleGetFiles = async () => {
        const updatedFilesToDownload = updateFilesToDownloadList();
        let newFilesContentString = titleFileContentHeader + "\n"
        fetchFilesData(updatedFilesToDownload).then((filesData) => {
            setFilesContent(filesData);
            for (const file of filesData) {
                newFilesContentString += "\nFile name and path: " + file.name + "\n" + file.data;
                console.log(newFilesContentString)
            }
            setFilesContentString(newFilesContentString)
        });
    }
    const handleFetch = async () => {
        const { owner, repo, path } = parseRepoLink(repoLink);
        try {
            const data = await fetchRecursive(owner, repo, path);
            setRepoData(data);
            onFetchComplete(data);
            setPureTree(dataTreeToPureTree(data))
            setDisplayTreeData(displayTreeDataConverter(data))
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    return (
        <>  
        <Group justify='center'>
            <TextInput
                label="Enter Repo Link"
                placeholder="GitHub repository link"
                value={repoLink}
                onChange={(event) => setRepoLink(event.currentTarget.value)}
                width="100%"
            />

            <TextInput
                label="GitHub API Token (optional)"
                placeholder="Enter your GitHub API token"
                value={apiToken}
                onChange={(event) => setApiToken(event.currentTarget.value)}
                width="100%"
            />
            <Checkbox
                label="Recursive"
                checked={recursive}
                onChange={(event) => setRecursive(event.currentTarget.checked)}
                mt="md"
            />
            <Button onClick={handleFetch}>Fetch Repository Data</Button>
            {error && (
                <Notification color="red" onClose={() => setError('')} mt="md">
                    {error}
                </Notification>
            )}
        </Group>
        <Space h="xl" />
            <Group justify='center'>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title>Repo Tree Structure JSON</Title>
                    {repoData && <Text>Use the copy button to remove whitespace</Text>}
                    {repoData && (
                        <>
                            <Textarea
                                label="Repository File Structure (JSON)"
                                value={JSON.stringify(pureTree, null, 1)}
                                maxRows={9}
                                mt="xl"
                                autosize
                            />

                            <CopyButton value={JSON.stringify(pureTree, null, 0)} >
                                {({ copied, copy }) => (
                                    <Button color={copied ? 'teal' : 'blue'} onClick={copy} mt="md">
                                        {copied ? 'Copied' : 'Copy JSON'}
                                    </Button>
                                )}
                            </CopyButton>
                        </>
                    )}
                    </Card>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Title>File Selector Tree</Title>
                    {repoData && <Text>Click on the Green to Expand a Directory</Text>}
                    {repoData && <>
                    <ScrollArea mah={500}>
                    <Box maw={700}>
                        <Tree data={displayTreeData} levelOffset={23} expandOnClick={true} renderNode={renderTreeNode} tree={treeRef} />
                        </Box>
                    </ScrollArea>
                        <Button onClick={handleGetFiles}> Fetch and add These Files as Context</Button>
                    </>
                    }
                </Card>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Title>File Content</Title>
                    {(filesContent.length != 0) && (
                        <>
                            <Textarea
                                label="File Data"
                                value={filesContentString}
                                maxRows={9}
                                mt="xl"
                                autosize
                            />
                            <CopyButton value={filesContentString} >
                                {({ copied, copy }) => (
                                    <Button color={copied ? 'teal' : 'blue'} onClick={copy} mt="md">
                                        {copied ? 'Copied' : 'Copy File Data'}
                                    </Button>
                                )}
                            </CopyButton>
                        </>
                    )}
                </Card>
            </Group>
        </>
    );
};

export default GitHubApiFetcher;
