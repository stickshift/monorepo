"""Library of custom logging filters."""

import asyncio as aio
import logging

__all__ = [
    "TaskNameFilter",
]


class TaskNameFilter(logging.Filter):
    """Appends custom taskname field to LogRecords."""

    def filter(self, record: logging.LogRecord) -> bool:
        """Appends custom taskname field to LogRecords."""
        try:
            record.taskname = f"{aio.current_task().get_name().split('.')[-1]}"
        except RuntimeError:
            record.taskname = "(none)"

        return super().filter(record)
