# LoadX (OpenGL Modular Engine)

**A Modern 3D Graphics Engine for Model Visualization and Rendering**

LoadX is a robust, modular graphics engine built with C++17 and OpenGL 3.3. It is designed to provide a professional environment for loading, viewing, and inspecting 3D models with Physically Based Rendering (PBR) and real-time performance monitoring.

---

## 1. Features & Capabilities

### Advanced Rendering
* **Core Pipeline:** Modern OpenGL 3.3+ with programmable shaders.
* **Material System:** Full PBR support (Physically Based Rendering) including Metallic/Roughness workflows.
* **Lighting:** Real-time support for Directional, Point, and Spot lights.
* **Texture Support:** Automatic detection of Diffuse, Normal, Specular, and Height maps.

### Multi-Format Model Support
Powered by **Assimp**, LoadX supports 20+ formats including:
* **.obj** (Wavefront - with native MTL support)
* **.fbx** (Filmbox)
* **.gltf / .glb** (GL Transmission Format)
* **.dae** (Collada)
* **.stl** (Stereolithography)

### Interactive Interface
Built with **Dear ImGui**, the UI features:
* **Dark Theme:** Professional visual style.
* **Real-time Stats:** FPS monitoring, Frame time, and Memory usage.
* **Inspectors:** Material property editors and Transform controls.

---

## 2. Technical Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Language** | C++17 | Core logic and systems |
| **Graphics API** | OpenGL 3.3+ | Hardware accelerated rendering |
| **Windowing** | GLFW 3.x | Cross-platform window & input management |
| **Math** | GLM | OpenGL Mathematics library |
| **Asset Import** | Assimp | 3D model loading pipeline |
| **GUI** | Dear ImGui | Immediate mode user interface |

---

## 3. Installation Guide

### Prerequisites
* **OS:** Windows (Recommended) or Linux.
* **Compiler:** Visual Studio 2022 (MSVC) or GCC with C++17 support.
* **Build System:** CMake 3.15+.
* **Git:** Version control.

### Step-by-Step Build (Windows)

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/AfonsoPaiva/LoadX.git
    ```
2. **Open in Visual Studio:**
    Launch `OpenGL-Modular-Engine.sln`.
3. **Select Configuration:**
    Choose **Release** mode from the top toolbar (Debug mode is significantly slower).
4. **Build:**
    Press `Ctrl + Shift + B` to build the solution.
5. **Run:**
    Locate the executable in `bin/Release/` and launch it.

*Note: All dependencies (GLFW, GLAD, GLM, etc.) are included in the repository. No external package manager is needed.*

---

## 4. User Manual

### Controls

| Input | Action |
| :--- | :--- |
| **W, A, S, D** | Move Camera (Fly Mode) |
| **Mouse Left + Drag** | Look Around / Pan |
| **Mouse Scroll** | Zoom In / Out |
| **F12** | Take Screenshot |
| **ESC** | Exit Application |

### UI Panels Guide

1. **Model Loader:** Click "Select Model File" to open the native file browser. Large models will show a progress bar.
2. **Transform:** Use sliders to adjust Position, Rotation, and Scale. Use "Auto-Center" to fix offset models.
3. **Lighting:** Adjust the sun direction (Directional) or add Point lights to test material roughness/metallic properties.
4. **Stats:** Monitor GPU performance. If FPS drops, check if you are running in Debug mode instead of Release.

---

## 5. System Architecture

The engine follows a modular Object-Oriented design:

* **Window Class:** Wraps GLFW, handles context creation and input callbacks.
* **Camera Class:** Implements 6-DOF movement using Euler angles (Yaw, Pitch).
* **Model/Mesh Classes:**
    * *Mesh:* Stores VBO/VAO/EBO data for a single geometry part.
    * *Model:* Aggregates multiple Meshes and manages texture resources.
* **Shader System:**
    * *Vertex Shader:* Handles MVP matrices and Normal/Tangent space calculation.
    * *Fragment Shader:* Calculates Blinn-Phong lighting and PBR maps.

### Folder Structure
* `src/`: C++ Source files (.cpp).
* `include/`: Header files (.h).
* `shaders/`: GLSL shader code (.vert, .frag).
* `vendor/`: Third-party libraries.
