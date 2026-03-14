"""Test script for DoserStatus.update_from merging logic (standalone)."""

from dataclasses import dataclass
from typing import Optional, List, Tuple

@dataclass(slots=True)
class HeadSnapshot:
    """Decoded information for a single head in the status frame."""
    mode: int
    hour: int
    minute: int
    dosed_tenths_ml: int
    extra: bytes

@dataclass(slots=True)
class DoserStatus:
    """High level representation of a status notification."""
    message_id: Optional[Tuple[int, int]]
    response_mode: Optional[int]
    weekday: Optional[int]
    hour: Optional[int]
    minute: Optional[int]
    heads: List[HeadSnapshot]
    tail_targets: List[int]
    tail_flag: Optional[int]
    tail_raw: bytes
    lifetime_totals_tenths_ml: List[int]
    raw_payload: bytes = b""

    def update_from(self, other: "DoserStatus") -> None:
        """Merge data from another status object, keeping existing data if other is empty."""
        if other.heads:
            self.heads = other.heads
        if other.tail_targets:
            self.tail_targets = other.tail_targets
        if other.lifetime_totals_tenths_ml:
            self.lifetime_totals_tenths_ml = other.lifetime_totals_tenths_ml
        
        # Update other fields if they are not None
        if other.message_id is not None:
            self.message_id = other.message_id
        if other.response_mode is not None:
            self.response_mode = other.response_mode
        if other.weekday is not None:
            self.weekday = other.weekday
        if other.hour is not None:
            self.hour = other.hour
        if other.minute is not None:
            self.minute = other.minute
        if other.tail_flag is not None:
            self.tail_flag = other.tail_flag
        if other.tail_raw:
            self.tail_raw = other.tail_raw
        if other.raw_payload:
            self.raw_payload = other.raw_payload

def test_doser_status_merging():
    """Verify that DoserStatus.update_from merges partial data correctly."""
    
    # Start with a baseline status (e.g., from 0xFE status message)
    head1 = HeadSnapshot(mode=1, hour=10, minute=0, dosed_tenths_ml=50, extra=b"")
    initial_status = DoserStatus(
        message_id=(0, 1),
        response_mode=0xFE,
        weekday=1,
        hour=10,
        minute=5,
        heads=[head1],
        tail_targets=[100],
        tail_flag=1,
        tail_raw=b"tail",
        lifetime_totals_tenths_ml=[],
        raw_payload=b"raw1"
    )
    
    # Create a partial update (e.g., from 0x1E lifetime message)
    update_status = DoserStatus(
        message_id=(0, 2),
        response_mode=0x1E,
        weekday=None,
        hour=None,
        minute=None,
        heads=[],
        tail_targets=[],
        tail_flag=None,
        tail_raw=b"",
        lifetime_totals_tenths_ml=[500],
        raw_payload=b"raw2"
    )
    
    # Merge the update into the initial status
    initial_status.update_from(update_status)
    
    # Verify the results
    assert initial_status.message_id == (0, 2)
    assert initial_status.response_mode == 0x1E
    assert initial_status.weekday == 1  # Kept from initial
    assert initial_status.hour == 10    # Kept from initial
    assert initial_status.minute == 5   # Kept from initial
    assert len(initial_status.heads) == 1
    assert initial_status.heads[0].mode == 1
    assert initial_status.tail_targets == [100]  # Kept from initial
    assert initial_status.lifetime_totals_tenths_ml == [500]  # Updated from second
    assert initial_status.raw_payload == b"raw2"
    
    print("DoserStatus merging test PASSED!")

if __name__ == "__main__":
    test_doser_status_merging()
