/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import FileUtilities from "../../FileUtilities/main";
import GitHubAPI from "./GHApi";
const ModuleManager = Java.type("com.chattriggers.ctjs.engine.module.ModuleManager").INSTANCE

const mf = Config.modulesFolder
const prefix = "&f[&dGitCT&f]&r "
export function importDependencies(modules: string[]) {

    modules.forEach(ele => {
        const exists = FileUtilities.isDirectory(`${mf}/${ele}`)
        if (exists) return;
        
        const stat = ModuleManager.importModule(ele)
        if (stat == null)  {
            ChatLib.chat(`${prefix}&cFailed to import dependency ${ele}`)
            return;
        }
        ChatLib.chat(`${prefix}&aImported dependency ${ele}`)
    })
}

export function cloneRepoRecursive(user, repo, branch, path?, nested = false) {
    if (!path) {
        GitHubAPI.getFileMap(user, repo, branch).then((res) => {
            res.data.forEach((file) => {
                if (file.type === "dir") {
                    FileUtilities.newDirectory(`${mf}/${repo}/${file.path}`)
                    cloneRepoRecursive(user, repo, branch, file.path)
                } else {
                    //@ts-ignore
                   FileUtilities.urlToFile(`${GitHubAPI.rawURL}${user}/${repo}/${branch}/${file.path}`, `${mf}/${repo}/${file.path}`, 5000, 5000)
                }
            })
        
    })  
    } else {
        GitHubAPI.getMapDir(user, repo, branch, path).then((res) => {
            res.data.forEach((file) => {
                if (file.type === "dir") {
                    if (!nested) {
                        FileUtilities.newDirectory(`${mf}/${repo}/${file.path}`)
                        cloneRepoRecursive(user, repo, branch, file.path)
                    } else {
                        FileUtilities.newDirectory(`${mf}/${file.path}`)
                        cloneRepoRecursive(user, repo, branch, file.path, true)
                    }
                   
                } else {
                    //@ts-ignore
                  if (!nested) FileUtilities.urlToFile(`${GitHubAPI.rawURL}${user}/${repo}/${branch}/${file.path}`, `${mf}/${repo}/${file.path}`, 5000, 5000)
                    else FileUtilities.urlToFile(`${GitHubAPI.rawURL}${user}/${repo}/${branch}/${file.path}`, `${mf}/${file.path}`, 5000, 5000)
                }
            })
    })
}}

export const gloalJobs = {}

export const helpTC = (command: string, description: string) => new TextComponent(`&0&l- &e${command} &a${description}`).setClick("suggest_command", command).setHoverValue(`&3Click to copy the command into your chatbox`)