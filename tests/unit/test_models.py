"""Tests for models.py."""

import pytest
from custom_components.aquable.device_control.models import (
    DoserStatus,
    HeadSnapshot,
)

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
        tail_targets=[100, 0, 0, 0],
        tail_flag=1,
        tail_raw=b"\x64\x00\x00\x00\x01",
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
        lifetime_totals_tenths_ml=[500, 1000, 0, 0],
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
    assert initial_status.tail_targets == [100, 0, 0, 0]  # Kept from initial
    assert initial_status.lifetime_totals_tenths_ml == [500, 1000, 0, 0]  # Updated from second
    assert initial_status.raw_payload == b"raw2"

def test_head_snapshot_logic():
    """Test HeadSnapshot methods."""
    head = HeadSnapshot(mode=0, hour=10, minute=30, dosed_tenths_ml=155, extra=b"")
    assert head.mode_label() == "daily"
    assert head.dosed_ml() == 15.5
    
    head_disabled = HeadSnapshot(mode=4, hour=0, minute=0, dosed_tenths_ml=0, extra=b"")
    assert head_disabled.mode_label() == "disabled"

def test_doser_status_lifetime_ml():
    """Test DoserStatus.lifetime_totals_ml."""
    status = DoserStatus(
        message_id=None, response_mode=None, weekday=None, hour=None, minute=None,
        heads=[], tail_targets=[], tail_flag=None, tail_raw=b"",
        lifetime_totals_tenths_ml=[100, 255, 1000, 0]
    )
    assert status.lifetime_totals_ml() == [10.0, 25.5, 100.0, 0.0]
