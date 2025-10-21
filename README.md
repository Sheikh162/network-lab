# NodeLabs: A Web-Based Virtual Machine Sandbox

NodeLabs is a full-stack application designed to create, manage, and interact with QEMU-based virtual machines through a simple and modern web interface. It leverages QEMU's efficient qcow2 overlay system for instant node creation and integrates with Apache Guacamole to provide seamless, in-browser console access to the virtual nodes.

## 📹 Project Demo

[![NodeLabs Project Demo](./assets/thumbnail.png)](https://youtu.be/bnMm-nO8pSg)

*Click the thumbnail above to watch the full project demonstration video.*

## 🌐 Live Demo

**Deployed Simulation (Frontend Only):**  
 [https://network-lab-chi.vercel.app/](https://network-lab-chi.vercel.app/)
 if the above doesnt work as expected (like api errors etc), try the below links:
 [https://network-lab-git-frontend-simulation-sheikh162s-projects.vercel.app/](https://network-lab-git-frontend-simulation-sheikh162s-projects.vercel.app/)
 [https://network-ibjc4i8zg-sheikh162s-projects.vercel.app/](https://network-ibjc4i8zg-sheikh162s-projects.vercel.app/)

> ⚠️ **Note:**  
> This deployment is an early **frontend simulation** of the project.  
> The current version demonstrates the user interface and workflow only — virtual machine creation and backend integrations (e.g., QEMU, Guacamole) are **not yet functional**, but can be used when installed locally (follow instructions below).  
> A full version with live VM management will be released later on the main branch.


## 🚀 Current Status

> 🏗 **Development done, full deployment yet to complete**
>
> The `master` branch contains the **main backend-integrated version** of the project.
>  
> It will support:
> - Creating and managing real VM instances  
> - QEMU-based virtualization  
> - Guacamole-powered browser console access  
> - Persistent node management and API control  

A functional **frontend-only simulation** is already live for previewing the UI flow.

---

## ✨ Features

- **Complete VM Lifecycle Management**: Create, run, stop, wipe, and delete virtual nodes via a clean user interface.
- **Efficient Disk Storage**: Utilizes QEMU's qcow2 copy-on-write overlays, where each VM only stores its changes from a central base image, saving significant disk space.
- **Integrated Web Console**: Access the graphical console of any running VM directly from the browser, powered by an integrated Apache Guacamole stack.
- **Concurrent Operations**: Designed to run and manage multiple isolated virtual machines simultaneously, with automatic VNC port allocation.
- **Containerized Architecture**: The entire application stack (Next.js App, Guacamole, Database) is managed with Docker Compose for simplified setup and consistent deployment.

## 🏗️ Architecture

The platform consists of several key services orchestrated by Docker Compose:

- **Next.js Application**: A full-stack Next.js app serving both the React frontend and the backend API routes. It communicates with the host system to execute QEMU commands.
- **QEMU**: The core hypervisor responsible for running the VMs. It is installed as a dependency within the Next.js container.
- **Guacamole Stack**:
  - **guacamole**: The web client that provides the browser-based terminal access.
  - **guacd**: The native proxy that translates between the web client and the VM's VNC server.
  - **postgres**: A PostgreSQL database used by Guacamole to store its connection configurations.

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Framework | Next.js (React, API Routes) |
| Language | TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Virtualization | QEMU |
| Remote Access | Apache Guacamole, VNC |
| Database | PostgreSQL |
| Containerization | Docker, Docker Compose |

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- **Docker and Docker Compose** must be installed.
- **QEMU** must be installed on the host machine for local development (`npm run dev`).
- A **Base QCOW2 Image**: You need a base OS disk image from which to create your VM overlays.

### 1. Clone the Repository

```bash
git clone [https://github.com/Sheikh162/network-lab.git](https://github.com/Sheikh162/network-lab.git)
cd network-lab 
```

### 2\. Create, Populate `base_images`, `overlays`, `data` Directories

The application expects base disk images to be located in the `base_images/` directory.
Create the directory in root of the project if it doesn't exist, along with `overlays`, `data/nodes.json`:

Bash

```bash
# Create required directories
mkdir -p base_images overlays data

# Initialize nodes.json with an empty array
echo '[]' > data/nodes.json
```

Place your `.qcow2` image files inside this folder. You can create your own or download pre-built cloud images.
**Example using a downloaded cloud image:**

Bash

```bash
# Download a Cirros test image
wget [https://download.cirros-cloud.net/0.5.2/cirros-0.5.2-x86_64-disk.img](https://download.cirros-cloud.net/0.5.2/cirros-0.5.2-x86_64-disk.img)

# Rename and move it to the correct location
mv cirros-0.5.2-x86_64-disk.img base_images/cirros.qcow2
```

### 3\. Configure Environment Variables

Create a `.env.local` file in the project root by copying the example:
Bash

```bash
cp .env.example .env.local
```

### 4\. Run the Application

The entire stack is defined in the `docker-compose.yml` file. Run the following command from the project root to build and start all services except Next.js:

Bash

```bash
docker-compose up --build
```

This command will:
-   Pull the required images for Postgres and Guacamole.
-   Start all services.

Since the Next.js application is not managed by Docker Compose, you'll need to run it directly on your local machine.

First, install the necessary dependencies using your preferred package manager.

Install Dependencies:

Bash
```bash
npm install
```
This command reads the package.json file and installs all the required Node.js packages into the node_modules directory.
Start the Development Server: Once the dependencies are installed, start the Next.js development server.

Bash
```bash
npm run dev
```
The frontend application will now be running and accessible in your web browser, typically at http://localhost:3000
* * * * *

📖 How to Use
-------------
1.  **Access the Frontend**: Open your web browser and navigate to `http://localhost:3000/lab`.
2.  **Create a Node**: Select a base image from the dropdown menu and click "Add Node". This will create a new qcow2 overlay file for the VM.
3.  **Run the Node**: Click the "Run" button (play icon) on a stopped node. The backend will start a QEMU instance and automatically register it as a new connection in Guacamole.
4.  **Open the Console**: Once the node's status is "running", click the node's name or screen area. This will open the Guacamole interface, giving you direct remote access.
5.  **Manage Nodes**:
    -   **Stop**: Shuts down the VM process. The state of the disk is preserved.
    -   **Wipe**: Resets the node to its original state by deleting and recreating its overlay disk.
    -   **Delete**: Permanently removes the node and its associated overlay disk.
* * * * *

📡 API Endpoints
----------------
The backend exposes the following REST API for managing nodes:

| **Method** | **Endpoint** | **Description** |
| --- | --- | --- |
| GET | `/api/nodes` | Retrieve a list of all nodes and their status. |
| POST | `/api/nodes` | Create a new node and its overlay disk. |
| POST | `/api/nodes/:id/run` | Start the VM for the specified node/run/route.ts . |
| POST | `/api/nodes/:id/wipe` | Reset a node's overlay disk/wipe/route.ts . |

* * * * *

🎯 Key Implementation Details
-----------------------------

### QEMU Overlay System

Each virtual node uses a copy-on-write overlay disk created with a command similar to this:

Bash

```bash
qemu-img create -f qcow2 -o backing_file=/path/to/base.qcow2 /overlays/node_<id>.qcow2
```

This approach provides:
-   **Space Efficiency**: Only changes from the base image are stored in each overlay.
-   **Quick Provisioning**: New nodes are created in seconds.
-   **Easy Reset**: Deleting and recreating an overlay restores the original state.
-   **Isolation**: Each node operates independently without affecting others.

### Guacamole Integration

When a VM starts, the backend:
1.  Launches QEMU with VNC enabled on a unique, automatically-determined port.
2.  Makes an API call to the Guacamole service to automatically register the VNC connection in its database.
3.  Returns the unique Guacamole console URL to the frontend for one-click access.

* * * * *

📁 Project Structure
--------------------

```bash
network-lab/
├── assets/               # Demo videos and other assets
├── base_images/          # Base QEMU images (you must create this)
├── data/                 # Stores the nodes database (nodes.json)
├── init/                 # SQL initialization scripts for Guacamole DB
├── overlays/             # Node overlay disks (auto-generated)
├── public/               # Static assets for Next.js
├── src/
│   ├── app/              # Next.js App Router pages and API routes
│   ├── components/       # React components
│   └── lib/              # Core backend logic (nodeManager, guacamoleService)
├── docker-compose.yml    # Service orchestration
├── .env.local            # Local environment variables (you must create this)
├── .env.example          # Example environment variables
├── .gitignore
└── README.md

```

* * * * *

🔧 Configuration
----------------

The application is configured through environment variables in `.env.local` and `docker-compose.yml`.
-   **`GUACAMOLE_ADMIN_PASSWORD`**: Sets the password for the `guacadmin` user in Guacamole. By default, password is `guacadmin`.

* * * * *

🐛 Troubleshooting
------------------

### Guacamole Console Not Loading
-   Ensure all services are running: `docker-compose ps`
-   Check guacd logs for connection errors: `docker-compose logs -f guacd`

### View Service Logs
Bash

```bash
# View logs for all services
docker-compose logs -f

# View logs for a specific service
docker-compose logs -f guacamole
```

