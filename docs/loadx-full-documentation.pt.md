# LoadX (Motor Modular OpenGL)

**Um Motor Gráfico 3D Moderno para Visualização e Renderização de Modelos**

LoadX é um motor gráfico robusto e modular construído com C++17 e OpenGL 3.3. Foi projetado para fornecer um ambiente profissional para carregar, visualizar e inspecionar modelos 3D com Renderização Baseada em Física (PBR) e monitoramento de desempenho em tempo real.

---

## 1. Recursos e Capacidades

### Renderização Avançada
* **Pipeline Principal:** OpenGL 3.3+ moderno com shaders programáveis.
* **Sistema de Materiais:** Suporte completo a PBR (Physically Based Rendering), incluindo fluxos de trabalho Metallic/Roughness.
* **Iluminação:** Suporte em tempo real para luzes Direcionais, Pontuais e Spot.
* **Suporte a Texturas:** Detecção automática de mapas Diffuse, Normal, Specular e Height.

### Suporte Multi-Formato
Impulsionado pelo **Assimp**, o LoadX suporta mais de 20 formatos, incluindo:
* **.obj** (Wavefront - com suporte nativo a MTL)
* **.fbx** (Filmbox)
* **.gltf / .glb** (GL Transmission Format)
* **.dae** (Collada)
* **.stl** (Estereolitografia)

### Interface Interativa
Construída com **Dear ImGui**, a UI apresenta:
* **Tema Escuro:** Estilo visual profissional.
* **Estatísticas em Tempo Real:** Monitoramento de FPS, Tempo de Quadro e Uso de Memória.
* **Inspetores:** Editores de propriedades de materiais e controles de Transformação.

---

## 2. Tech Stack (Tecnologias)

| Componente | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Linguagem** | C++17 | Lógica principal e sistemas |
| **API Gráfica** | OpenGL 3.3+ | Renderização acelerada por hardware |
| **Janelas** | GLFW 3.x | Gerenciamento de janelas e entrada multiplataforma |
| **Matemática** | GLM | Biblioteca de Matemática OpenGL |
| **Importação** | Assimp | Pipeline de carregamento de modelos 3D |
| **GUI** | Dear ImGui | Interface de usuário em modo imediato |

---

## 3. Guia de Instalação

### Pré-requisitos
* **SO:** Windows (Recomendado) ou Linux.
* **Compilador:** Visual Studio 2022 (MSVC) ou GCC com suporte a C++17.
* **Sistema de Build:** CMake 3.15+.
* **Git:** Controle de versão.

### Passo a Passo (Windows)

1. **Clonar o Repositório:**
    ```bash
    git clone https://github.com/AfonsoPaiva/LoadX.git
    ```
2. **Abrir no Visual Studio:**
    Inicie o arquivo `OpenGL-Modular-Engine.sln`.
3. **Selecionar Configuração:**
    Escolha o modo **Release** na barra de ferramentas superior (o modo Debug é significativamente mais lento).
4. **Compilar:**
    Pressione `Ctrl + Shift + B` para compilar a solução.
5. **Executar:**
    Localize o executável em `bin/Release/` e inicie-o.

*Nota: Todas as dependências (GLFW, GLAD, GLM, etc.) estão incluídas no repositório. Nenhum gerenciador de pacotes externo é necessário.*

---

## 4. Manual do Utilizador

### Controlos

| Entrada | Ação |
| :--- | :--- |
| **W, A, S, D** | Mover Câmera (Modo Voo) |
| **Mouse Esq + Arrastar** | Olhar ao Redor / Panorâmica |
| **Rolagem do Mouse** | Zoom In / Out |
| **F12** | Tirar Captura de Ecrã |
| **ESC** | Sair da Aplicação |

### Guia dos Painéis da UI

1. **Carregador de Modelos:** Clique em "Select Model File" para abrir o explorador de ficheiros nativo. Modelos grandes mostrarão uma barra de progresso.
2. **Transformação:** Use os controlos deslizantes para ajustar Posição, Rotação e Escala. Use "Auto-Center" para corrigir modelos deslocados.
3. **Iluminação:** Ajuste a direção do sol (Direcional) ou adicione luzes Pontuais para testar a rugosidade/metalicidade dos materiais.
4. **Estatísticas:** Monitorize o desempenho da GPU. Se o FPS cair, verifique se está a executar no modo Debug em vez de Release.

---

## 5. Arquitetura do Sistema

O motor segue um design Modular Orientado a Objetos:

* **Classe Window:** Envolve o GLFW, lida com criação de contexto e callbacks de entrada.
* **Classe Camera:** Implementa movimento 6-DOF usando ângulos de Euler (Yaw, Pitch).
* **Classes Model/Mesh:**
    * *Mesh:* Armazena dados VBO/VAO/EBO para uma única parte da geometria.
    * *Model:* Agrega várias Meshes e gere recursos de textura.
* **Sistema de Shader:**
    * *Vertex Shader:* Lida com matrizes MVP e cálculo de espaço Normal/Tangente.
    * *Fragment Shader:* Calcula iluminação Blinn-Phong e mapas PBR.

### Estrutura de Pastas
* `src/`: Ficheiros de código fonte C++ (.cpp).
* `include/`: Ficheiros de cabeçalho (.h).
* `shaders/`: Código shader GLSL (.vert, .frag).
* `vendor/`: Bibliotecas de terceiros.
