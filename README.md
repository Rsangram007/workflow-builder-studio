# HR Workflow Designer

A visual workflow designer module for HR administrators to create and test internal workflows such as onboarding, leave approval, and document verification.

![HR Workflow Designer](https://lovable.dev/opengraph-image-p98pqg.png)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

## 📋 Features

### Workflow Canvas (React Flow)
- **5 Node Types**: Start, Task, Approval, Automated Step, and End nodes
- **Drag-and-Drop**: Drag nodes from the sidebar onto the canvas
- **Connect Nodes**: Click and drag from node handles to create connections
- **Select & Edit**: Click any node to open its configuration panel
- **Delete**: Select nodes/edges and press Backspace or Delete
- **Validation**: Auto-validates constraints (e.g., Start node required)
- **Zoom & Pan**: Mouse wheel to zoom, drag to pan
- **Mini Map**: Navigate large workflows easily

### Node Configuration Forms
Each node type has a dedicated configuration panel with type-specific fields:

| Node Type | Fields |
|-----------|--------|
| **Start** | Title, Metadata key-value pairs |
| **Task** | Title*, Description, Assignee, Due Date, Custom Fields |
| **Approval** | Title, Approver Role (dropdown), Auto-approve Threshold |
| **Automated** | Title, Action (from API), Dynamic Parameters |
| **End** | End Message, Show Summary toggle |

### Mock API Layer
- `GET /automations` - Returns available automated actions with their parameters
- `POST /simulate` - Accepts workflow JSON and returns step-by-step execution

### Workflow Testing/Sandbox
- Serialize and validate workflow structure
- Step-by-step execution animation
- Visual timeline of execution
- Error and warning display

### Import/Export
- Export workflows as JSON
- Import previously saved workflows

## 🏗️ Architecture

```
src/
├── api/
│   └── mockApi.ts           # Mock API layer for automations and simulation
├── components/
│   └── workflow/
│       ├── forms/           # Node configuration forms
│       │   ├── StartNodeForm.tsx
│       │   ├── TaskNodeForm.tsx
│       │   ├── ApprovalNodeForm.tsx
│       │   ├── AutomatedNodeForm.tsx
│       │   ├── EndNodeForm.tsx
│       │   └── NodeFormPanel.tsx
│       ├── nodes/           # Custom React Flow nodes
│       │   ├── StartNode.tsx
│       │   ├── TaskNode.tsx
│       │   ├── ApprovalNode.tsx
│       │   ├── AutomatedNode.tsx
│       │   ├── EndNode.tsx
│       │   └── index.ts
│       ├── NodePalette.tsx      # Draggable node palette
│       ├── WorkflowCanvas.tsx   # React Flow canvas
│       ├── WorkflowDesigner.tsx # Main orchestrator component
│       ├── WorkflowHeader.tsx   # Header with actions
│       ├── WorkflowSidebar.tsx  # Left sidebar
│       └── WorkflowSandbox.tsx  # Testing panel
├── context/
│   └── WorkflowContext.tsx  # Global workflow state management
├── hooks/
│   └── useWorkflowDesigner.ts # Custom hook for designer logic
├── types/
│   └── workflow.ts          # TypeScript interfaces and types
└── pages/
    └── Index.tsx            # Main page
```

## 🎨 Design Decisions

### State Management
- **React Context + Hooks**: Chose React Context for global workflow state over Redux for simplicity and because the state is localized to the workflow designer
- **Controlled Components**: All form inputs are controlled for predictable state updates
- **Separation of Concerns**: Canvas logic, node logic, and API logic are cleanly separated

### Component Architecture
- **Custom Nodes**: Each node type is a separate component for maintainability
- **Form Components**: Each node type has its own form component with type-specific validation
- **Reusable UI**: Leverages shadcn/ui components for consistent styling

### Type Safety
- **Discriminated Unions**: Node data types use discriminated unions for type-safe node handling
- **Strict TypeScript**: Full type coverage for all components and functions

### Scalability Considerations
- **Node Type Extension**: Adding new node types requires:
  1. Add type to `NodeType` union
  2. Create node data interface
  3. Create node component
  4. Create form component
  5. Register in `nodeTypes` and form panel
- **Action Extension**: New automated actions can be added to `mockApi.ts`

## 🧪 Workflow Validation

The system validates:
- ✅ Exactly one Start node required
- ✅ At least one End node required
- ✅ All nodes must be connected
- ✅ Start node must have outgoing connection
- ✅ End node must have incoming connection
- ✅ No cycles in the workflow

## 📦 Tech Stack

- **React 18** - UI framework
- **React Flow (@xyflow/react)** - Node-based graph visualization
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Vite** - Build tool
- **TanStack Query** - Data fetching (available for future API integration)

## 🔮 Future Enhancements

With more time, I would add:

1. **Undo/Redo** - History stack for canvas operations
2. **Auto-Layout** - Automatic node positioning using dagre
3. **Node Templates** - Pre-built workflow templates
4. **Visual Validation Errors** - Show errors directly on nodes
5. **Conditional Branching** - Support for decision nodes
6. **Version History** - Track workflow changes over time
7. **Real-time Collaboration** - Multiple users editing simultaneously
8. **Backend Persistence** - Save workflows to database
9. **Workflow Versioning** - Compare and rollback versions
10. **Analytics Dashboard** - Workflow execution metrics

## 📝 Assumptions

1. Workflows are acyclic directed graphs (no loops)
2. Single entry point (one Start node)
3. Can have multiple End nodes for different outcomes
4. Mock API simulates network latency for realism
5. Browser-only (no server-side rendering required)

## 🧑‍💻 Author

Built with [Lovable](https://lovable.dev)

---

## License

MIT
