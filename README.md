# VeloxERP - Nuxt-Based ERP System
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](code_of_conduct.md)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

VeloxERP is a modern Enterprise Resource Planning system built with Nuxt.js. It’s designed to streamline business processes and support data-driven decision-making within internal business environments. Currently in active development and working towards our first release, VeloxERP brings together key operational areas including logistics (merchandise management, stock overview, warehouse management), finances, orders and inquiries, and a complete POS system.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Installation Steps](#installation-steps)
- [Configuration](#configuration)
- [Usage](#usage)
    - [Development](#development)
    - [Production](#production)
- [Resources](#resources)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

## Overview
VeloxERP leverages Nuxt.js for server-side rendering and a smooth user experience. The system integrates essential business functions such as logistics (merchandise management, warehouse management), finances, orders and inquiries, and a POS system into one unified platform. This internal tool is designed to enhance operational efficiency and support data-driven decision-making within your organization.

## Features
- **Nuxt.js Integration:** Delivers a fast and dynamic frontend application.
- **Modular Architecture:** Easily customize and extend functionalities as business needs evolve.
- **User-Friendly Interface:** Intuitive design for efficient navigation and ease of use.
- **Comprehensive Business Modules:**
    - **Logistics:** Merchandise management, stock overview, and warehouse management.
    - **Finances:** Financial management and reporting.
    - **Orders & Inquiries:** Handling customer orders and inquiries.
    - **POS System:** Integrated Point-of-Sale solution.
- **Robust Security:** Advanced measures to protect sensitive business data.
- **Scalability:** Adaptable for organizations of varying sizes.

## Installation

### Prerequisites
- **Node.js:** Version 14 or higher.
- **pnpm:** For package management.
- **MySQL Database:** A MySQL database is required for data storage.
- **Reverse Proxy (Production):** A reverse proxy is recommended to point to the Nuxt application for production environments.

### Installation Steps
1. **Clone the Repository:**  
   Run the following commands:
   ```
   git clone https://github.com/VeloxERP/VeloxERP.git
   cd VeloxERP
   ```
2. **Install Dependencies using pnpm:**
   ```
   pnpm install
   ```
3. **Database Setup:**  
   Configure your MySQL database and update the connection settings in the configuration files as needed.

## Configuration
Adjust the configuration files to tailor VeloxERP to your environment:
- **nuxt.config.js:** Main configuration file for Nuxt.js settings.
- **.env:** Environment-specific variables such as API keys, database credentials, etc.

## Usage

### Development
To run the development server, execute:
```
pnpm run dev
```
This will start the Nuxt.js development server, usually accessible at [http://localhost:3000](http://localhost:3000).

### Production
For a production build, run:
```
pnpm run build
pnpm run start
```
It is recommended to set up a reverse proxy (e.g., using Nginx) to route requests to the Nuxt application for a robust production environment.

## Resources
Here are some useful resources to help you get started and work effectively with VeloxERP:
- **Official Nuxt.js Documentation:** [https://nuxtjs.org/docs](https://nuxtjs.org/docs)
- **Database**
    - [https://orm.drizzle.team/docs/sql-schema-declaration](https://orm.drizzle.team/docs/sql-schema-declaration)
    - [https://hub.nuxt.com/docs/recipes/drizzle](https://hub.nuxt.com/docs/recipes/drizzle)
- **Authentification**
    - [https://nuxt.com/docs/guide/recipes/sessions-and-authentication](https://nuxt.com/docs/guide/recipes/sessions-and-authentication)
    - [https://github.com/atinux/nuxt-auth-utils?tab=readme-ov-file#webauthn-passkey](https://github.com/atinux/nuxt-auth-utils?tab=readme-ov-file#webauthn-passkey)
- **Component Libary**
    - [https://www.shadcn-vue.com/](https://www.shadcn-vue.com/)
- **Discussions:** [https://github.com/VeloxERP/VeloxERP/discussions](https://github.com/VeloxERP/VeloxERP/discussions)
- **Wiki:** [https://github.com/VeloxERP/VeloxERP/wiki](https://github.com/VeloxERP/VeloxERP/wiki)

## Contributing
Contributions are welcome! Please see our [CONTRIBUTING](.github/CONTRIBUTING.md) guidelines for instructions on reporting issues, suggesting new features, or submitting pull requests. Your contributions help make VeloxERP better for everyone.

## License
This project is licensed under the Apache License, Version 2.0. For more details, refer to the [LICENSE](LICENSE) file.

## Acknowledgements
A special thank you to all the developers, contributors, and the open-source community who have helped shape and improve VeloxERP.