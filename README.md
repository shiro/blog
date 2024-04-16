<div align="center">
    <h1>Blog of a programming rabbit</h1>
    <h3>My personal blog and portfolio website on which I discuss new technologies, libraries and awesome hacks that make the world go round.</h3>

[![GitHub](https://img.shields.io/badge/GitHub-code-blue?logo=github)](https://github.com/shiro/blog)
[![MIT License](https://img.shields.io/github/license/shiro/blog?color=43A047&logo=linux&logoColor=white)](https://github.com/shiro/blog/blob/master/LICENSE)
[![Build](https://img.shields.io/github/actions/workflow/status/shiro/blog/CI.yml?color=00897B&logo=github-actions&logoColor=white)](https://github.com/shiro/blog/actions/workflows/CI.yml)
[![Donate](https://img.shields.io/badge/Ko--Fi-donate-orange?logo=ko-fi&color=E53935)](https://ko-fi.com/C0C3RTCCI)

</div>

<div align="center">
    <h3>Deployed at <a href="https://usagi.io">usagi.io</a></h3>
</div>

Built with a bleeding edge tech stack that enables quick development combined with amazing developer experience!

- 🪛 **Full stack**, built with [Solid Start](https://start.solidjs.com) + custom plugins/components
- 📦 **Small bundle size** using the [Solid.js](https://www.solidjs.com) framework
- 🖌️ **CSS in JS** with no runtime JS code, using [Linaria](https://linaria.dev)
- 💾 **Statically built**, deployed on [Github pages](https://pages.github.com)
- ❤️ **Open source**, made with love

---

<div align="center">
    <b>If you like open source, consider supporting</b>
    <br/>
    <br/>
    <a href='https://ko-fi.com/C0C3RTCCI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi3.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
</div>

## Run it locally

Clone the repository and run:

```bash
yarn install
yarn dev
```

For more, check out the [Solid Start documentation](https://start.solidjs.com).

## Known issues

### Pre-transform error: ENOENT

On the first run there's often issues with vite optimised files missing, such as:

```
10:43:53 AM [vite] Pre-transform error: ENOENT: no such file or directory, open '/project/node_modules/.vinxi/client/deps/classnames.js' (x2)
...
```

This is a known linaria bug, it's being tracked [here](https://github.com/vitejs/vite/issues/14493).
The workaround is to type `r<ENTER>` into the terminal which will restart the vinxi server.

## Authors

- Matic Utsumi Gačar <matic@usagi.io>
