"""TikTok LIVE clipper: pick winning moments from performance data and cut them.

Public entry points:
    Config       -- configuration with validated defaults
    SessionInput -- one live recording plus its performance report
    run_session  -- score, refine, lint and render
"""

from .config import Config
from .models import Candidate, ClipResult, Finding, HourScore, PerfRow, Segment

__version__ = "0.1.0"

__all__ = [
    "Config", "Candidate", "ClipResult", "Finding", "HourScore", "PerfRow",
    "Segment", "__version__",
]
