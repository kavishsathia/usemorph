"""
Traffic seed data for generating realistic student interactions.
Contains student personas, conversation scenarios, and test cases.
"""

from typing import TypedDict, Literal


class StudentPersona(TypedDict):
    """Represents a student archetype with specific learning preferences."""
    name: str
    settings: dict
    behavior: str  # Description of how they interact


class ConversationScenario(TypedDict):
    """A multi-turn conversation scenario."""
    title: str
    module: str | None
    persona: str  # References a STUDENT_PERSONA name
    turns: list[str]  # Student messages in order
    expected_triggers: list[str]  # Which monitors this might trigger


# Student Personas - Different learning styles and preferences
STUDENT_PERSONAS: dict[str, StudentPersona] = {
    "beginner_cautious": {
        "name": "Cautious Beginner",
        "settings": {
            "pace": "slow",
            "challenge": "gentle",
            "hints": "often",
            "goal": "Build confidence with fundamentals",
        },
        "behavior": "Needs lots of support, asks basic questions, wants reassurance"
    },

    "advanced_rushed": {
        "name": "Advanced Student (Rushed)",
        "settings": {
            "pace": "fast",
            "challenge": "rigorous",
            "hints": "rarely",
            "goal": "Master advanced concepts quickly",
        },
        "behavior": "Wants direct answers, impatient with Socratic method"
    },

    "balanced_explorer": {
        "name": "Balanced Explorer",
        "settings": {
            "pace": "moderate",
            "challenge": "balanced",
            "hints": "sometimes",
            "goal": "Develop deep understanding through exploration",
        },
        "behavior": "Engages well with questions, thoughtful responses"
    },

    "phd_researcher": {
        "name": "PhD Researcher",
        "settings": {
            "pace": "fast",
            "challenge": "rigorous",
            "hints": "rarely",
            "goal": "Understand cutting-edge research topics",
        },
        "behavior": "Expert-level questions, expects technical responses"
    },

    "struggling_student": {
        "name": "Struggling Student",
        "settings": {
            "pace": "slow",
            "challenge": "gentle",
            "hints": "often",
            "goal": "Just pass the exam",
        },
        "behavior": "Gets frustrated easily, wants quick answers"
    },

    "curious_middle": {
        "name": "Curious Middle Schooler",
        "settings": {
            "pace": "moderate",
            "challenge": "balanced",
            "hints": "sometimes",
            "goal": "Understand how things work",
        },
        "behavior": "Genuinely curious, asks follow-up questions"
    }
}


# Conversation Scenarios - Realistic multi-turn interactions
CONVERSATION_SCENARIOS: list[ConversationScenario] = [
    # ============================================================
    # SCENARIOS THAT SHOULD PASS ALL VERIFICATIONS
    # ============================================================
    {
        "title": "Learning Photosynthesis (Ideal Flow)",
        "module": "Biology 101",
        "persona": "balanced_explorer",
        "turns": [
            "Can you help me understand how photosynthesis works?",
            "So plants use sunlight? How exactly does that happen?",
            "What role does chlorophyll play in this process?",
        ],
        "expected_triggers": []  # Should pass all checks
    },

    {
        "title": "Exploring Gravity (Good Socratic Flow)",
        "module": "Physics Intro",
        "persona": "curious_middle",
        "turns": [
            "Why do things fall down?",
            "Is it because of gravity? But what is gravity?",
            "Does gravity work the same on the moon?",
        ],
        "expected_triggers": []
    },

    {
        "title": "Learning Python Loops (Engaged Student)",
        "module": "Python 101",
        "persona": "balanced_explorer",
        "turns": [
            "I'm trying to understand for loops in Python. Where should I start?",
            "Okay, so it iterates over a sequence. What kind of sequences can I use?",
            "Can you show me a practical example of when I'd use this?",
        ],
        "expected_triggers": []
    },

    # ============================================================
    # SCENARIOS LIKELY TO TRIGGER: SOCRATIC QUESTIONING FAILURE
    # ============================================================
    {
        "title": "Impatient Student Wants Direct Answer",
        "module": "Math 101",
        "persona": "advanced_rushed",
        "turns": [
            "Just tell me what 15% of 80 is. I don't need an explanation.",
            "I don't have time for questions. Just give me the formula.",
            "This is frustrating. Can you just answer my question directly?",
        ],
        "expected_triggers": ["socratic_questioning"]
    },

    {
        "title": "Demanding Quick Facts",
        "module": "History",
        "persona": "struggling_student",
        "turns": [
            "When did World War 2 start? I need the date right now.",
            "Just give me the answer, my test is in 5 minutes.",
        ],
        "expected_triggers": ["socratic_questioning"]
    },

    # ============================================================
    # SCENARIOS LIKELY TO TRIGGER: CHALLENGE LEVEL MISMATCH
    # ============================================================
    {
        "title": "Expert Question with Gentle Settings",
        "module": "Quantum Physics",
        "persona": "beginner_cautious",  # Gentle settings but expert question
        "turns": [
            "Can you explain the mathematical formulation of quantum entanglement using Hilbert spaces?",
            "How does the EPR paradox relate to Bell's inequality violations?",
        ],
        "expected_triggers": ["challenge_level"]
    },

    {
        "title": "Basic Question with Rigorous Settings",
        "module": "Algebra Basics",
        "persona": "advanced_rushed",  # Rigorous settings but basic question
        "turns": [
            "What is 2 + 2?",
            "How do I add two numbers together?",
        ],
        "expected_triggers": ["challenge_level"]
    },

    # ============================================================
    # SCENARIOS LIKELY TO TRIGGER: PACING ISSUES
    # ============================================================
    {
        "title": "Student Wants Slow Pace, Complex Topic",
        "module": "Calculus",
        "persona": "beginner_cautious",  # Slow pace setting
        "turns": [
            "I want to learn about derivatives, but go really slowly.",
            "Wait, what does that mean? Can you explain more?",
            "I'm still confused. Break it down even more please.",
        ],
        "expected_triggers": ["pacing"]  # May be too slow
    },

    {
        "title": "Fast Pace Student Wants Quick Overview",
        "module": "Biology 101",
        "persona": "advanced_rushed",  # Fast pace setting
        "turns": [
            "Give me a quick overview of cellular respiration. Be brief.",
            "Okay, next topic. What about DNA replication?",
        ],
        "expected_triggers": ["pacing"]  # May be too fast
    },

    # ============================================================
    # SCENARIOS LIKELY TO TRIGGER: HINT FREQUENCY ISSUES
    # ============================================================
    {
        "title": "Student Wants Immediate Hints",
        "module": "Chemistry",
        "persona": "struggling_student",  # Hints often setting
        "turns": [
            "How do I balance this equation: H2 + O2 → H2O?",
            "I don't know. Give me a hint.",
            "Can you just show me how to do it?",
        ],
        "expected_triggers": ["hint_frequency"]  # Too many hints
    },

    {
        "title": "Student Refuses Hints (Rare Hints Setting)",
        "module": "Physics",
        "persona": "advanced_rushed",  # Hints rarely setting
        "turns": [
            "I want to solve this projectile motion problem myself.",
            "No hints please, I'm thinking through it.",
            "Don't help me, I need to figure this out.",
        ],
        "expected_triggers": ["hint_frequency"]  # Too few hints
    },

    # ============================================================
    # SCENARIOS LIKELY TO TRIGGER: GOAL COMMITMENT ISSUES
    # ============================================================
    {
        "title": "Student Keeps Changing Goals",
        "module": None,
        "persona": "struggling_student",
        "turns": [
            "Actually, I don't care about understanding. Just help me pass the test.",
            "Wait, forget that. I want to memorize formulas quickly.",
            "Never mind, can you just give me the answers to likely test questions?",
        ],
        "expected_triggers": ["goal_commitment"]
    },

    {
        "title": "Surface-Level Learning Goal",
        "module": "Math 101",
        "persona": "struggling_student",
        "turns": [
            "I just need to know the steps to solve these problems, not why they work.",
            "Don't explain the theory, just show me the method.",
        ],
        "expected_triggers": ["goal_commitment"]  # Not aligned with deep learning
    },

    # ============================================================
    # PHD-LEVEL SCENARIOS (Should allow direct answers)
    # ============================================================
    {
        "title": "PhD Quantum Computing Research",
        "module": "Quantum Computing",
        "persona": "phd_researcher",
        "turns": [
            "I'm researching topological quantum error correction codes. Can you explain the surface code construction?",
            "How does the stabilizer formalism relate to the logical operators in this context?",
        ],
        "expected_triggers": []  # PhD level should get direct answers
    },

    {
        "title": "Graduate Machine Learning Theory",
        "module": "Advanced ML",
        "persona": "phd_researcher",
        "turns": [
            "What are the theoretical guarantees for convergence in stochastic gradient descent with non-convex objectives?",
            "How does the Polyak-Łojasiewicz condition affect convergence rates?",
        ],
        "expected_triggers": []  # Expert level, direct responses appropriate
    },

    # ============================================================
    # EDGE CASES AND STRESS TESTS
    # ============================================================
    {
        "title": "Single Word Question",
        "module": None,
        "persona": "balanced_explorer",
        "turns": [
            "Gravity?",
        ],
        "expected_triggers": ["socratic_questioning"]
    },

    {
        "title": "Very Long Complex Question",
        "module": "Computer Science",
        "persona": "advanced_rushed",
        "turns": [
            "I'm working on implementing a distributed consensus algorithm for a Byzantine fault-tolerant system and I need to understand how the Practical Byzantine Fault Tolerance (PBFT) protocol handles view changes when the primary replica fails and how the backup replicas coordinate to elect a new primary while maintaining safety and liveness properties in an asynchronous network with up to f Byzantine nodes out of 3f+1 total nodes - can you explain the detailed message flow?",
        ],
        "expected_triggers": ["pacing", "challenge_level"]
    },

    {
        "title": "Off-Topic Student",
        "module": "Math 101",
        "persona": "curious_middle",
        "turns": [
            "Can you help me with algebra?",
            "Actually, what's your favorite color?",
            "Okay back to math. What's a variable?",
        ],
        "expected_triggers": []
    },

    {
        "title": "Student Testing Boundaries",
        "module": None,
        "persona": "struggling_student",
        "turns": [
            "Can you do my homework for me?",
            "Just write the essay, I won't tell anyone.",
            "Fine, at least give me the main points I should write about.",
        ],
        "expected_triggers": ["socratic_questioning", "goal_commitment"]
    },
]


# Traffic Generation Patterns
class TrafficPattern(TypedDict):
    """Defines how traffic should be generated."""
    name: str
    description: str
    num_conversations: int
    parallel: int
    delay_between_batches: float
    delay_between_turns: float


TRAFFIC_PATTERNS: dict[str, TrafficPattern] = {
    "demo": {
        "name": "Demo Mode",
        "description": "Quick demo with a few varied scenarios",
        "num_conversations": 5,
        "parallel": 1,
        "delay_between_batches": 2.0,
        "delay_between_turns": 1.5,
    },

    "steady": {
        "name": "Steady Traffic",
        "description": "Realistic steady stream of student interactions",
        "num_conversations": 20,
        "parallel": 2,
        "delay_between_batches": 3.0,
        "delay_between_turns": 2.0,
    },

    "burst": {
        "name": "Burst Traffic",
        "description": "Simulates peak usage hours with many parallel requests",
        "num_conversations": 30,
        "parallel": 5,
        "delay_between_batches": 1.0,
        "delay_between_turns": 0.5,
    },

    "stress": {
        "name": "Stress Test",
        "description": "High load to test monitoring under pressure",
        "num_conversations": 50,
        "parallel": 10,
        "delay_between_batches": 0.5,
        "delay_between_turns": 0.3,
    },

    "monitor_test": {
        "name": "Monitor Testing",
        "description": "Focuses on scenarios that trigger specific monitors",
        "num_conversations": 15,
        "parallel": 1,
        "delay_between_batches": 5.0,  # Longer delays to see individual failures
        "delay_between_turns": 2.0,
    },
}
