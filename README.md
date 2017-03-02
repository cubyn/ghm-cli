# GHM - Github multi-repo milestones CLI

Inspired from [ghi](https://github.com/stephencelis/ghi).

Useful coupled with Zenhub which supports milestones spanned on multiple repositories.

## Installation

**`ghm-cli` is available for node 7 only... Feel free to make a babelified version via PRs :-)**

1. ```npm i -g ghm-cli```
2. ```ghm login```

## Usage

```shell
$ ghm --help

ghm <cmd> [args]

Commands:
  login               Login to Github (no password ever stored)
  list                List milestones in all your repos
  close [milestone]   Close milestone
  open [milestone]    Re-open milestone
  update [milestone]  Update milestone

Options:
  --help  Show help   [boolean]

Examples:
  list --state all                              Will list all milestones accross your repos
  close "Milestone #1"                          Will close all milestones named "Milestone #1"
  update "Milestone #1" --title milestone-1     Will rename all milestones named "Milestone #1" to "milestone-1"
```

## Advanced configuration

In `~/.ghm.json` you can add these extra options:

### `ignore` to speed-up the milestone lookup for specific repos

```json
{
    "ignore": [
        "my-org/repo-1",
        "my-org/repo-2"
    ]
}
```