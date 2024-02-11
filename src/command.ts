/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import FileUtilities from "../../FileUtilities/main"
import {gloalJobs, helpTC, cloneRepoRecursive, importDependencies } from "./utils"
import GitHubAPI from "./GHApi"
const mf = Config.modulesFolder
const prefix = "&f[&dGitCT&f]&r "
const header = `&f----------[&dGitCT&f]----------`

const gitCTCommand = (arg0, arg1, arg2) => {

    if (arg0 === "help" ||  arg0 === undefined) {
        if (arg1 === undefined) {
            ChatLib.chat(header)
            ChatLib.chat(helpTC("/gitct help [command]", "Shows this help menu or a help menu for a specific command"))
            ChatLib.chat(helpTC("/gitct import <user>/<repo>#branch [module]", "Imports a module from GitHub"))
        } else if (arg1 === "help") {
            ChatLib.chat(header)
            ChatLib.chat(helpTC("/gitct help [command]", "Shows this help menu or a help menu for a specific command"))
            ChatLib.chat(`&0&l- &e[command] &aOptional. The command to show help for`)
        } else if (arg1 === "import") {
            ChatLib.chat(header)
            ChatLib.chat(helpTC("/gitct import <user>/<repo>#branch [module]", "Imports a module from GitHub"))
            ChatLib.chat(`&0&l- &e<user> &aRequired. The GitHub user who owns the repo. Case sensitive`)
            ChatLib.chat(`&0&l- &e<repo> &aRequired. The repo of the module to import. Case sensitive`)
            ChatLib.chat(`&0&l- &e#branch &aOptional. The branch to import from. Defaults to the default branch`)
            ChatLib.chat(`&0&l- &e[module] &aOptional. If the module is in a subdirectory, specify it here`)

        } else {
            ChatLib.chat(`${prefix}&c/gitct ${arg1} is not a valid command`)
        }
        return;

    }
    if (arg0 === "import") {
        if (!arg1) {
            ChatLib.chat(`${prefix}&cPlease provide a user and repo`)
            return;
        }
        let [ user, repo] = arg1?.split("/")
        if (!user || !repo) {
            ChatLib.chat(`${prefix}&cPlease provide a user and repo`)
            return;
        }
        let branch
        console.log(repo)
        //if (repo.includes("#")) {
            let arr = repo.split("#")
            repo = arr[0]
            branch = arr[1]
        //}
        console.log(branch)
        const e = FileUtilities.isDirectory(`${mf}/${repo}`)
        if (e) {
            ChatLib.chat(`${prefix}&c${repo} already exists in your modules folder`)
            return;
        }

        if (!arg2) {
   
        GitHubAPI.getRepo(user, repo).then((res) => {
            const { default_branch } = res.data
            branch = branch ? branch : default_branch
            GitHubAPI.checkMetadataDotJson(user, repo, branch).then((metadata) => {
                if (!metadata.data) { 
                    ChatLib.chat(`${prefix}&c${user}/${repo}#${branch} is not a valid module (1)`)
                    return;
                }
                const requires = metadata.data.requires || []
               importDependencies(requires)
               GitHubAPI.getTree(user, repo, branch).then((rawT) => {
                    const tree = rawT.data.tree
                    const totalFiles = tree.filter((file) => file.type === "blob")
                    FileUtilities.newDirectory(`${mf}/${repo}`)
                    gloalJobs[repo] = {
                        total: totalFiles.length,
                        trigger: register("step", () => {
                            const tl: any = FileUtilities.listFilesRecursive(`${mf}/${repo}`)
                            if (tl.length >= totalFiles.length) {
                                ChatLib.chat(`${prefix}&aSucessfully Imported ${user}/${repo}#${branch}`)
                                gloalJobs[repo].trigger.unregister()
                                gloalJobs[repo] = undefined
                                ChatTriggers.loadCT()
                            }
                        }).setFps(5)
                    }

                    ChatLib.chat(`${prefix}&aImporting ${user}/${repo}#${branch}`)
                    cloneRepoRecursive(user, repo, branch)
               })
            }).catch(e => {
                if (e.code === 404) {
                    ChatLib.chat(`${prefix}&c${user}/${repo}#${branch} is not a valid module (404)`)   
                } else ChatLib.chat(`${prefix}&cAn unknown error occured: ${e.code}`)
            })
        }).catch(e => {
            if (e.code === 404) {
                ChatLib.chat(`${prefix}&c${user}/${repo}#${branch} is not a GitHub repo (404)`)   
            } else ChatLib.chat(`${prefix}&cAn unknown error occured: ${e.code}`)
        
        })
    } else {

        GitHubAPI.getRepo(user, repo).then((res) => {
            const { default_branch } = res.data
            branch = branch ? branch : default_branch
            GitHubAPI.checkMetadataDotJson(user, repo, branch, arg2).then((metadata) => {
                if (!metadata.data) { 
                    ChatLib.chat(`${prefix}&c${user}/${repo} is not a valid module (2)`)
                    return;
                }
                const requires = metadata.data.requires || []
                importDependencies(requires)
                GitHubAPI.getTree(user, repo, branch, arg2).then((rawT) => {
                    const tree = rawT.data.tree
                    const totalTree  = tree.filter((file) => file.type === "blob")
                    const totalFiles = totalTree.filter((file) => file.path.startsWith(`${arg2}/`))
                    FileUtilities.newDirectory(`${mf}/${arg2}`)
                    gloalJobs[arg2] = {
                        total: totalFiles.length,
                        trigger: register("step", () => {
                            const tl: any = FileUtilities.listFilesRecursive(`${mf}/${arg2}`)
                            if (tl.length >= totalFiles.length) {
                                ChatLib.chat(`${prefix}&aSucessfully Imported ${user}/${repo}#${branch}/${arg2}`)
                                gloalJobs[repo].trigger.unregister()
                                gloalJobs[repo] = undefined
                                ChatTriggers.loadCT()
                            }
                        }).setFps(5)
                    }
                    ChatLib.chat(`${prefix}&aImporting ${user}/${repo}#${branch}/${arg2}`)
                   
                    cloneRepoRecursive(user, repo, branch, arg2, true)
                })
            }).catch(e => {
               if (e.code === 404) {
                ChatLib.chat(`${prefix}&c${user}/${repo}#${branch}/${arg2} is not a valid module (404)`)   
               } else ChatLib.chat(`${prefix}&cAn unknown error occured: ${e.code}`)
            })
                

        }).catch(e => {
            if (e.code === 404) {
                ChatLib.chat(`${prefix}&c${user}/${repo} is not a GitHub repo (404)`)   
            } else ChatLib.chat(`${prefix}&cAn unknown error occured: ${e.code}`)
        
        })
    }} else if (arg0 === "delete") {
        ChatLib.chat(new TextComponent(`${prefix}&cPlease use /ct delete <module>`).setClick("suggest_command", "/ct delete", ).setHoverValue("&3Click to copy the command into your chatbox"))
    } else if (arg0 === "update") {
        ChatLib.chat(`${prefix}&cUpdating modules is not supported yet. You can delete the module and reimport it to update it`)
    } else {
        ChatLib.chat(`${prefix}&c/gitct ${arg0} is not a valid command`)
    }
}

export default gitCTCommand