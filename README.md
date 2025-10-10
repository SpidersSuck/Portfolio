# Mini Web Game Portal with MCP Integration - Project Phase Implementation

## Course: CptS 483 Special Topic - Coding with Agentic AI
## Track: Web Development
## Project Phase: Weeks 8-14 (Individual Project)

---

## 📋 Project Overview

The Mini Web Game Portal is an accessible, keyboard-first web application featuring three browser-based minigames (Tic-Tac-Toe, Snake, Memory Match). This project demonstrates how Model Context Protocol (MCP) transforms manual agent coordination into automated, robust multi-agent orchestration. Building on Assignment 3's foundation, Assignment 4 integrates MCP to coordinate three specialized AI agents (ChatGPT, DeepSeek, Gemini) through structured workflows that eliminate manual context handoffs, enable real-time error recovery, and ensure 100% information preservation across all agent transitions.

The platform serves as both a functional gaming hub and a demonstration of professional multi-agent development practices applicable to distributed teams and production systems.

### Target Users
- Students learning web development and accessibility best practices
- Developers exploring multi-agent AI coordination patterns
- Casual gamers seeking accessible browser-based entertainment
- Instructors teaching AI-assisted development methodologies

### Core Use Cases
1. **Accessible Gaming**: Play three browser-based games with full keyboard support and screen reader compatibility
2. **Multi-Agent Development Study**: Examine MCP coordination patterns through documented agent interactions
3. **Accessibility Reference**: Use as example of WCAG-compliant game portal implementation
4. **Educational Platform**: Learn structured AI agent coordination for distributed development

---

## 🎯 Project Goals & Success Criteria

### Core Features (Must Complete)
- [x] Three fully playable games (Tic-Tac-Toe, Snake, Memory Match)
- [x] MCP-coordinated development with automated context preservation
- [x] WCAG 2.1 AA accessibility compliance
- [x] Responsive design (mobile, tablet, desktop)
- [x] LocalStorage score persistence
- [x] Comprehensive documentation of MCP integration

### Stretch Goals (If Time Permits)
- [ ] Additional games (Card game, Puzzle game)
- [ ] Multiplayer support via WebSockets
- [ ] User authentication system
- [ ] Global leaderboard with backend

### Success Metrics
- **Functional Completeness**: All 3 games playable with keyboard controls, scores persist, no critical bugs
- **Multi-Agent Coordination**: Zero context loss, 100% specification compliance, automatic error recovery
- **Professional Quality**: WCAG AA compliance, 0 accessibility violations (axe DevTools), clean code with documentation
- **Portfolio Readiness**: Complete GitHub repository, demo video, comprehensive technical documentation

---

## 🗂️ Technical Architecture

### Technology Stack
- **Primary Language**: JavaScript (ES6+) with JSX
- **Framework**: React 18.2 with Vite 5.0
- **Styling**: Vanilla CSS with CSS variables (no frameworks)
- **Database**: LocalStorage for client-side persistence
- **Key Libraries**: React DOM for rendering
- **Deployment**: Static hosting (Vercel/Netlify recommended)

### Multi-Agent System Design

#### Agent 1: ChatGPT (Planning & Documentation)
- **Primary Responsibility**: Project architecture, specifications, documentation, coordination strategy
- **Input**: Project requirements, assignment criteria, coordination challenges
- **Output**: Project outline, agent role definitions, README files, integration logs, coordination strategies
- **AI Tool**: ChatGPT (GPT-4)
- **Coordination Role**: Defines interfaces and specifications consumed by DeepSeek and Gemini

#### Agent 2: DeepSeek (Frontend Implementation)
- **Primary Responsibility**: Portal structure, UI components, responsive layout, accessibility implementation
- **Input**: Project specifications from ChatGPT, component requirements, styling guidelines
- **Output**: React components (Navbar, GameCard, pages), CSS styling, responsive grid, accessibility features (ARIA labels, keyboard navigation)
- **AI Tool**: DeepSeek
- **Coordination Role**: Implements specifications from ChatGPT, provides component API for Gemini's games

#### Agent 3: Gemini (Game Development)
- **Primary Responsibility**: Game logic, mechanics implementation, keyboard controls, game-specific accessibility
- **Input**: Component API from DeepSeek, game specifications from ChatGPT, accessibility requirements
- **Output**: Three game components (TicTacToe.jsx, Snake.jsx, Memory.jsx), keyboard controls, game state management, score persistence
- **AI Tool**: Google Gemini
- **Coordination Role**: Implements games following DeepSeek's component interface, adheres to ChatGPT's specifications

### Architecture Diagram
```
┌─────────────────────────────────────────────────┐
│            MCP Coordinator                      │
│  (Context Management + Error Recovery)          │
└─────────────┬───────────────────────────────────┘
              │
      ┌───────┼───────┐
      │       │       │
┌─────▼────┐ ┌▼──────▼┐ ┌─────────▼┐
│ ChatGPT  │ │DeepSeek │ │  Gemini  │
│ Planning │ │Frontend │ │  Games   │
└──────────┘ └─────────┘ └──────────┘
      │           │            │
      └───────────┼────────────┘
                  │
        ┌─────────▼──────────┐
        │  Shared Context    │
        │  - Specifications  │
        │  - Interfaces      │
        │  - Decisions       │
        └────────────────────┘
```
