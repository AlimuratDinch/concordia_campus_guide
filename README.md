# Concordia Campus Guide App
## prerequisites
The following packaged with specified version should be installed: `node.js`, version:`v22.13.0`
<br>
You can install it following that link: https://nodejs.org/en

## Installation

### Chaning directory to the repo
`cd minicap_concordia/application`
### Changing the branch
`git checkout develop`

### Installing the expo
`npm install expo`
### Running the Up
`npx expo start` or `npx expo start -c`. The second command will delete the cache
## Members
Bulat Abdullin - 40264963 <br>
Alimurat Dinchdonmez - 40245310 <br>
Azmi Abidi - 40248132 <br>
Nektarios - 40211948 <br>
Joseph Aladas - 40156616 <br>
Marc-Yves Malchev - 40265238 <br>
Ryad Alla - 40227731<br>

## Branch Naming Convention
The branch name should be all small letter with a `snake_case` convention
- `feature/name_of_your_branch` : Your branch contains a new feature
- `chore/name_of_your_branch` : Your branch contains the code to automate the project, but not the project by itself
- `docs/name_of_your_branch` : Your branch add the documentaion
- `fix/name_of_your_branch` : Your branch fixes some code (bugs)
- `test/name_of_your_branch` : Your branch adds tests
- `refactor/name_of_your_branch` : Your branch refactors the code

Example: 
```
docs/branch_and_commits_conventions
```
## Commit Messages
### Issue Numbering
> **_NOTE:_**  You should just include the Issue Number in your last Commit Message.
- Your commit message should first indicate the issue number starting with GH
- If you want to link your commit message to the specific issue (which is mandotary), you should write GH-number_of_the_issue

EX: I want to link my issue with a number 18 to link, i start with: `(GH-18)`
### Commit shortcut description
The shortcut description should be used after the issue number
![image](https://github.com/user-attachments/assets/ab366f4f-ca44-4287-983f-6e0c59fe7aa6)

### Pull request number
GitHub puts automatically your PR number

Full Example of the commit message : 
```
(GH-18) docs: commit and branch naming conventions
```
Full Example of the commit message by GitHub after merging: `(GH-18) docs: commit and branch naming conventions (#19)` 
- (GH-18): The issue number (which is 18)
- docs: describes that the commit focuses on the documentation of the process
- commit message that describes the meaning of your commit
- PR number: PR number that GitHub puts in your commit message automatically

## Color Palette
https://loading.io/color/feature/
