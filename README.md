<div align="center">
  <img src="public/logo.png" alt="Morph Logo" width="400">

  <h3>AI-Powered Socratic Learning Platform</h3>

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat&logo=python)
![Node](https://img.shields.io/badge/Node.js-20+-339933?style=flat&logo=node.js)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

</div>

---

## Overview

Morph is an educational platform that leverages artificial intelligence to facilitate discovery-based learning through the Socratic method. Rather than providing direct answers, the system guides students through strategic questioning and interactive simulations to develop deep conceptual understanding.

## Hackathon Submission

This project was built for the Google Cloud AI Partner Catalyst Hackathon (Datadog Challenge).

**Key Innovation:** Integration of the Sworn verification framework to ensure AI agent adherence to teaching principles, with comprehensive observability through Datadog.

**Repositories:**

- Application: https://github.com/kavishsathia/usemorph
- Sworn Framework: https://github.com/kavishsathia/sworn

**Live Demo:** https://usemorph.ai

## The Problem

Traditional AI tutoring systems operate as sophisticated information retrieval tools, providing immediate answers to student queries. This approach prioritizes speed over comprehension and encourages passive consumption rather than active engagement. Research consistently demonstrates that knowledge acquired through self-discovery results in significantly better retention and transferability compared to passively received information.

## Solution

Morph addresses this gap by implementing a pedagogically sound approach to AI-assisted learning:

**Socratic Questioning**: The system employs strategic questioning techniques to guide students through problem-solving processes rather than providing direct solutions.

**Dynamic Simulations**: Automatically generates interactive HTML/JavaScript visualizations tailored to specific concepts, enabling hands-on exploration.

**Adaptive Personalization**: Configurable parameters for pacing, challenge level, and hint frequency allow customization to individual learning preferences.

**Behavioral Verification**: Integrates the Sworn framework to monitor and ensure adherence to defined teaching principles.

**Multi-Panel Interface**: Split-screen design with conversational interface (35%) and interactive simulation workspace (65%).

**Structured Curriculum**: Modular organization of learning content across multiple domains.

---

## Technical Architecture

### Frontend Stack

- Next.js 16 (React 19) with TypeScript
- Tailwind CSS 4 with custom design system
- Framer Motion for animations
- Radix UI component primitives

### Backend Infrastructure

- Python-based AI agent (Google ADK + Gemini 2.0 Flash)
- Supabase (PostgreSQL with real-time subscriptions)
- Drizzle ORM for type-safe database access
- Trigger.dev for background task orchestration

### AI & Observability

- Sworn framework for agent commitment monitoring
- Datadog LLM observability
- Custom evaluation runbooks

---

## Installation

### Prerequisites

- Node.js 20 or higher
- Python 3.10 or higher
- Supabase account
- Trigger.dev account
- Google AI API key (Gemini access)

### Setup Instructions

**1. Clone Repository**

```bash
git clone https://github.com/yourusername/usemorph.git
cd usemorph
```

**2. Install Dependencies**

Frontend dependencies:

```bash
npm install
```

Python agent dependencies:

```bash
cd python
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

**3. Configure Environment Variables**

Create `.env.local` in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
DATABASE_URL=your_postgres_connection_string

# Trigger.dev Configuration
TRIGGER_SECRET_KEY=your_trigger_secret_key

# Google AI Configuration
GOOGLE_API_KEY=your_gemini_api_key

# Datadog Configuration (Optional)
DD_API_KEY=your_datadog_api_key
DD_SITE=datadoghq.com
```

**Configuration Sources:**

- **Supabase**: Project Settings → API at [supabase.com](https://supabase.com)
- **Trigger.dev**: Project dashboard at [trigger.dev](https://trigger.dev)
- **Google AI**: API key from [Google AI Studio](https://aistudio.google.com/apikey)
- **Datadog**: Account settings at [datadoghq.com](https://www.datadoghq.com/)

**4. Initialize Database**

Execute Drizzle migrations:

```bash
npm run db:push
```

This creates the required database schema:

- `users` - User authentication and profiles
- `chats` - Learning session metadata
- `events` - Conversation history and tool invocations
- `windows` - Interactive simulation state
- `modules` - Curriculum organization

**5. Start Development Environment**

Terminal 1 - Next.js development server:

```bash
npm run dev
```

Terminal 2 - Trigger.dev orchestration:

```bash
npx trigger.dev dev
```

Application available at [http://localhost:3000](http://localhost:3000)

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Client Application                     │
│  ┌──────────────┐                ┌──────────────────┐  │
│  │ Chat Panel   │                │ Simulation Panel │  │
│  │   (35%)      │                │      (65%)       │  │
│  │              │                │                  │  │
│  │  Message     │                │  Interactive     │  │
│  │  History     │                │  Windows         │  │
│  │              │                │                  │  │
│  └──────────────┘                └──────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
                 Supabase Real-time API
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Trigger.dev Background Task                │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │      Python Agent (Google ADK Framework)         │  │
│  │                                                  │  │
│  │  • System instruction generation                │  │
│  │  • Sworn commitment initialization              │  │
│  │  • LLM conversation processing (Gemini 2.0)     │  │
│  │  • Tool invocation (window creation, etc.)      │  │
│  │  • Teaching principle verification              │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## User Flow

1. **Authentication**: Account creation via Supabase Auth
2. **Session Configuration**: Define learning preferences (pacing, challenge level, hint frequency)
3. **Query Submission**: Student submits questions via chat interface
4. **Agent Processing**: Background task triggers Python agent with conversation context
5. **Response Generation**: Agent employs Socratic method and may invoke simulation tools
6. **Real-time Updates**: Responses and simulations pushed to client via Supabase subscriptions
7. **Interactive Exploration**: Student engages with generated simulations
8. **Persistence**: All interactions and window states stored for session continuity

---

## Development

### Database Commands

```bash
# Generate new migrations
npm run db:generate

# Apply schema changes
npm run db:push

# Launch Drizzle Studio
npm run db:studio
```

### Project Structure

```
usemorph/
├── app/                    # Next.js App Router
│   ├── chat/[id]/         # Chat session interface
│   ├── dashboard/         # Session management dashboard
│   └── api/               # API endpoints
├── components/            # React components
│   ├── chat/             # Chat interface components
│   ├── dashboard/        # Dashboard components
│   └── windows/          # Window management system
├── python/               # AI agent implementation
│   ├── agent.py         # Core agent logic
│   ├── contract.py      # Sworn commitment definitions
│   └── tools.py         # Agent tool implementations
├── db/                  # Database schema and migrations
├── lib/                 # Shared utility functions
└── wiki/                # Operational runbooks
```

---

## Observability & Monitoring

### Monitoring Strategy

Morph uses Datadog to monitor application health and AI agent behavior through:

1. **LLM Observability**: Token usage, latency, and cost per interaction
2. **Agent Verification**: Sworn framework commitments tracked in real-time
3. **User Experience**: Success rates and error patterns

### Detection Rules

Six detection rules monitor critical system signals:

**1. Socratic Questioning Verification**
Alerts when the AI provides direct answers instead of using guiding questions. Ensures core pedagogical principle adherence.

**2. Challenge Level Verification**
Monitors whether challenge difficulty appropriately matches student knowledge level. Prevents content that is too easy or too difficult.

**3. Goal Commitment Verification**
Ensures the AI guides students toward learning goals through active discovery rather than passive instruction.

**4. Hint Frequency Verification**
Tracks whether hints are provided at the right frequency - after reasonable student attempts, not immediately or too late.

**5. Pacing Verification**
Monitors conversation pacing to ensure balanced explanations and student input without overwhelming or under-engaging students.

**6. High Response Latency**
Alerts when response times exceed 15 seconds (warning) or 20 seconds (critical), indicating potential infrastructure or API issues.

All monitors trigger at 70% pass rate (critical) and 80% pass rate (warning) for evaluation-based rules.

### Service Level Objectives

Three SLOs define system reliability targets:

**1. Latency SLO**
Target: 95% of requests complete within acceptable response time thresholds.

**2. Error Rate SLO**
Target: Maintain error rates below defined thresholds to ensure consistent user experience.

**3. Cost Efficiency SLO**
Target: Monitor token usage and API costs to ensure sustainable operation.

### Datadog Configuration

All monitoring configurations are available in `/datadog/`:

- `dashboard.json` - Application health dashboard
- `monitors/` - Detection rule definitions
- `slos/` - Service level objective configurations

### Running the Traffic Generator

To demonstrate the monitoring system in action:

```bash
cd python
python traffic_generator.py
```

This generates various interaction patterns that trigger detection rules and create incidents in Datadog.

---

## Contributing

This project is currently maintained as a research initiative. Contributions, suggestions, and forks are welcome for educational and experimental purposes.

---

## License

MIT License

---

## Acknowledgments

Built with:

- [Google ADK](https://github.com/google/adk) - Agent Development Kit
- [Sworn](https://github.com/anthropics/sworn) - Agent behavior verification framework
- [Supabase](https://supabase.com) - Backend infrastructure
- [Trigger.dev](https://trigger.dev) - Background job orchestration
