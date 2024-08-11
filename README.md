# GitHub Repo to LLM

## Overview

The GitHub Repo to LLM tool is designed to convert a GitHub repository's file structure into JSON format. This format allows easy sharing and analysis of the repository's layout with a Large Language Model (LLM).

## Features

- **Fetch Repository Data**: Retrieve and display the file structure of a GitHub repository, including both directories and files.
- **Convert to JSON**: Transform the repository structure into JSON for simplified sharing and processing.
- **File Selector Tree**: Use an interactive tree view to select files and directories for downloading and sharing file contents as context for the LLM.

## Frameworks and Libraries

This application is built using React and Vite, with the Mantine UI library for user interface components. It utilizes the GitHub API to fetch repository data. Users can also provide their GitHub API token to access private repositories or handle larger repositories with the increased rate limits.