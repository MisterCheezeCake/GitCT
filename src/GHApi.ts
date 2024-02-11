/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import axios from "../../axios/index";

export default class GitHubAPI {
    static rawURL = "https://raw.githubusercontent.com/"
    static getRepo(user: string, repo: string) {
      return axios.get({
       url:`https://api.github.com/repos/${user}/${repo}`,
       parseBody: true
    });
    }
    static getBranches(user: string, repo: string) {
    return axios.get({
        url: `https://api.github.com/repos/${user}/${repo}/branches`,
        parseBody: true
    });
        }
    static getBranch(user: string, repo: string, branch: string) {
        return axios.get({
            url: `https://api.github.com/repos/${user}/${repo}/branches/${branch}`,
            parseBody: true
        }
        );
    }
    static getFileMap(user: string, repo: string, branch: string) {
        return axios.get({
            url: `https://api.github.com/repos/${user}/${repo}/contents?ref=${branch}`,
            parseBody: true
        }
        );
    }
   static getMapDir(user: string, repo: string, branch: string, path: string) {
        return axios.get({
            url: `https://api.github.com/repos/${user}/${repo}/contents/${path}?ref=${branch}`,
            parseBody: true
        }
        );
    }
    static checkMetadataDotJson(user: string, repo: string, branch: string, path?: string) {
        console.log(`${this.rawURL}${user}/${repo}/${branch}/${path ? path + "/" : ""}metadata.json`)
        return axios.get({
            url: `${this.rawURL}${user}/${repo}/${branch}/${path ? path + "/" : ""}metadata.json`,
            parseBody: true
        }
        );
    }
    static getTree(user: string, repo: string, branch: string, path?: string) {
        return axios.get({
            // I set a recursive limit of 10 because I don't think anyone will have a directory that deep
            url: `https://api.github.com/repos/${user}/${repo}/git/trees/${branch}?recursive=10`,
            parseBody: true
        }
        );
    }
}

