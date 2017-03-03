Inspired from [ghi](https://github.com/stephencelis/ghi).

This tool will be useful coupled with Zenhub which supports milestones spanned on multiple repositories.

## Installation

```shell
npm i -g ghm-cli
ghm login
```

## Requirements

- **Node 7**

`ghm` is runnable under node 7 only... Feel free to make a babelified version via PRs :-)

- **If you have enabled Github's 2FA security...**

`ghm login` will not function properly. A bit lazy there, sorry.
If so create by yourself an authentication token on Github and paste it in `~/.ghm.json`:

```
{
    "token": "<paste your token>",
    "org": "<your organization name>"
}
```

## Usage

- **list of commands**

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

- **help on one command**

```shell
$ ghm --help update

ghm update [milestone]

Options:
  --help       Show help                                               [boolean]
  --force, -f  force update on closed milestones as well               [boolean]
  --title, -t  title to change to                                       [string]
  --due, -d    milestone's due date. format: YYYY-MM-DD                 [string]
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

## Ideas, PRs welcome!

- Support Github 2FA
- Support Node 4+ via transpilation
- Add `ghm create [milestone]`
- Add logic to define named groups of repositories. This would scope each command on a reduced set of repositories. e.g. `ghm create UI-revamp --group front-apps`