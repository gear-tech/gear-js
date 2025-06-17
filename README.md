<p align="center">
  <a href="https://gear-tech.io">
    <img src="https://github.com/gear-tech/gear/blob/master/images/logo-grey.png" width="400" alt="GEAR">
  </a>
</p>
<h3 align="center">
    Gear-JS
</h3>
<p align=center>
    <a href="https://github.com/gear-tech/gear-js/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-GPL%203.0-success"></a>
    <a href="https://github.com/gear-tech/gear-js/actions/workflows/CI.yml"><img src="https://github.com/gear-tech/gear-js/actions/workflows/CI.yml/badge.svg" alt="CI"></a>
    <a href="https://discord.gg/7BQznC9uD9"><img src="https://img.shields.io/discord/891063355526217738?label=Discord&logo=discord" alt="Discord"></a>
</p>
<p align="center">
    <a href="https://wiki.gear-tech.io"><img src="https://img.shields.io/badge/Gear-Wiki-orange?logo=bookstack" alt="Gear Wiki"></a>
    <a href="https://idea.gear-tech.io"><img src="https://img.shields.io/badge/Gear-IDEA-blue?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADFSURBVHgBrVLLDYMwDH0OG7ABG5QNYIOwQRmhI3QERmCDMAIjsEFHgA2SDZyk5lRU1LQvQXLi2M+fDUQkLPpKz7MjNS/eN3VHGthSe0SHw2kN8bkwR4Rd9I3JGzWvkxXkQFD0z6Qs+6O0IQ9BlvXZVPDQYr9aNBglXmVUBqHLpCwqD6FTqhYHkfJkODmIpBMdEJVGh7pBZPmk+1rKL3lRfgeTxGrVY2T6z1TbUTKBhLrB1l4DkT+pMoBRzA5k4gCSzQP6wQlxwzh5ZgAAAABJRU5ErkJggg==" alt="Gear IDEA"></a>
</p>
<hr>

<h1 align="center">Overview</h1>

<p align="center">
A comprehensive collection of TypeScript/JavaScript libraries, tools, and services powering the Gear Protocol ecosystem. This monorepo contains everything developers need to build, test, and deploy applications on Gear.
</p>

## 📦 Core Packages

### [@gear-js/api](apis/gear) [![npm version](https://img.shields.io/npm/v/@gear-js/api.svg)](https://www.npmjs.com/package/@gear-js/api) [![npm downloads](https://img.shields.io/npm/dm/@gear-js/api.svg)](https://www.npmjs.com/package/@gear-js/api)

The main TypeScript library for interacting with Gear nodes. Features include:
- 📤 Program creating
- 🔄 Message sending and state querying
- 🔐 Account management and transaction signing
- 📡 WebSocket subscriptions for real-time updates
- 🔍 Payloads encoding

### [@gear-js/ui](utils/gear-ui) [![npm version](https://img.shields.io/npm/v/@gear-js/ui.svg)](https://www.npmjs.com/package/@gear-js/ui)

React components for Gear applications:
- 🎨 Pre-built UI components
- 📱 Responsive and accessible design
- 🔌 Easy integration with Gear API

### [@gear-js/txwrapper](tools/txwrapper) [![npm version](https://img.shields.io/npm/v/@gear-js/txwrapper.svg)](https://www.npmjs.com/package/@gear-js/txwrapper)

Offline transaction generation for the Gear Protocol:
- 🔒 Secure offline transaction creation
- 🔗 Integration with @substrate/txwrapper-core
- 📝 Support for all Gear pallet extrinsics

## 🛠 Tools & Services

### [Gear IDEA](idea/gear/frontend)

A development portal for Gear programs - [idea.gear-tech.io](https://idea.gear-tech.io)

Features:
- 🔧 Gear program deployment and testing environment
- 🔄 Program interaction and testing tools
- 👛 Account and balance management
- 📊 Network monitoring

### Supporting Services

| Service | Description |
|---------|-------------|
| [Explorer](idea/gear/explorer) | Node.js backend for indexed blockchain data |
| [Squid](idea/gear/squid) | Data indexing service using Squid SDK |
| [Faucet](idea/gear/faucet) | Testnet token distribution service |
| [Meta Storage](idea/gear/meta-storage) | Program metadata management service |

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/gear-tech/gear-js.git
cd gear-js
```

2. Install dependencies:
```bash
yarn install
```

3. Build all packages:
```bash
yarn build
```

## 📚 Documentation

- [API Documentation](apis/gear/README.md)
- [TxWrapper Guide](tools/txwrapper/README.md)
- [UI Components](utils/gear-ui/README.md)

## 🤝 Contributing

We welcome contributions! Please [create an issue](https://github.com/gear-tech/gear-js/issues/new) or [open a pull request](https://github.com/gear-tech/gear-js/pulls) on GitHub.

## 📄 License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.


<p align="center">
    <a href="https://twitter.com/gear_techs">
        <img src="https://raw.githubusercontent.com/gear-tech/gear/master/images/social-icon-1.svg" alt="twit" style="vertical-align:middle" >
    </a>
    <a href="https://github.com/gear-tech">
        <img src="https://raw.githubusercontent.com/gear-tech/gear/master/images/social-icon-2.svg" alt="github" style="vertical-align:middle" >
    </a>
    <a href="https://discord.gg/7BQznC9uD9">
        <img src="https://raw.githubusercontent.com/gear-tech/gear/master/images/social-icon-3.svg" alt="discord" style="vertical-align:middle" >
    </a>
    <a href="https://medium.com/@gear_techs">
        <img src="https://raw.githubusercontent.com/gear-tech/gear/master/images/social-icon-4.svg" alt="medium" style="vertical-align:middle" >
    </a>
    <a href="https://t.me/gear_tech">
        <img src="https://raw.githubusercontent.com/gear-tech/gear/master/images/social-icon-5.svg" alt="medium" style="vertical-align:middle" >
   </a>
</p>

