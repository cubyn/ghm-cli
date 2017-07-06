Inspired from [ghi](https://github.com/stephencelis/ghi).

Ghm as in Github Multi-repo.

Features:
- close, update and re-open milestones spanned on multiple repositories (useful for Zenhub users)
- list pull-requests on all organization repositories

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

```
ghm login                           login to Github
ghm clean                           clean ghm's cache (repositories)

# milestone commands
ghm milestone list                  list all milestones
ghm milestone open [milestone]      re-open milestone
ghm milestone close [milestone]     close milestone
ghm milestone update [milestone]    update milestone
ghm milestone create [milestone]    create a new milestone
ghm milestone delete [milestone]    permanently delete a milestone

# pull-request commands
ghm pull list                       list all pull-requests

# show help
ghm -h                              show top-level help
ghm milestone -h                    show all milestone commands
ghm milestone open -h               show help on a specific command
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