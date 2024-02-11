# GitCT

GitCT is a simple utility that allows the importing of ChatTriggers modules from GitHub. It currently only supports cloning the repository but support for the GitHub releases feature is planned.

## DISCLAIMER

Modules imported with GitCT are not verified and may contain malicious code. Always verify before downloading. **The developers of GitCT and ChatTriggers are not responsible for any adverse effects of modules downloaded with GitCT.**

## How to use

To import a module, use the `/gitct import` command. The command takes `User/Repo name` as a required first argument, and you can optionally specify a branch using a `#`. Not specifying a branch will clone the default branch. If the module you want to import is a subfolder, rather than the main folder, provide the name of that subfolder as the second argument.

Examples:

- `/gitct import MisterCheezeCake/UniversalBridge`: Imports the whole repo as the module from the main branch
- `/gitct import MisterCheezeCake/UniversalBridge#Alpha`: Imports the Alpha branch
- `/gitct import MisterCheezeCake/ChatTriggers-Modules SkyBlockKeybinds`: Imports the SkyBlockKeybinds module from the repository, which contains man modules
- `/gitct import MisterCheezeCake/ChatTriggers-Modules#SLBeta StatLink`: Imports StatLink from the beta branch

**The names of users, repositories, and modules are ALL case sensitive**

## Planned Features

- Importing Releases
- Ability to update modules without deleting and reimporting
- Support for copy pasting URLS into /gitct import

## What GitCT Can't Do

- Auto Updating: This is intentionally omitted and will not be included in the future, users must manually update for security reasons. I don't want this module downloading unverrified code without the user's explicit direction.

- Non CT Website Dependencies: This is also intentional and these will never be supported. GitCT will never download any unverified code expect for what the user explicitly requests. GitCT will handle CT Website dependencies like the normal /ct import command

## Support, Suggestions, and Bug Reports

Join my [Discord](https://discord.gg/uz2KfZ4BuT])

## License

GitCT is licensed under the [GNU AGPL 3](https://www.gnu.org/licenses/agpl-3.0.en.html)