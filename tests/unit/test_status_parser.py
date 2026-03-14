"""Tests for status_parser.py."""

import pytest
from custom_components.aquable.device_control.models import (
    DoserStatus,
    HeadSnapshot,
    LightStatus,
    LightKeyframe,
)
from custom_components.aquable.device_control.status_parser import (
    parse_doser_payload,
    parse_light_payload,
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

def test_parse_doser_status_fe():
    """Test parsing 0xFE status payload."""
    # Example payload for 0xFE: [5B, 00, 01, 00, 01, FE, WD, HR, MIN, ...4xHEADS(9B)..., TAIL(5B)]
    # Total length: 9 + 4*9 + 5 = 50 bytes
    payload = bytearray([0x5B, 0x00, 0x01, 0x00, 0x01, 0xFE, 0x01, 0x0A, 0x1E])
    # Head 1: mode=0, hour=10, min=30, extra=[0,0,0,0], dosed=100 (10.0ml)
    payload.extend([0x00, 0x0A, 0x1E, 0x00, 0x00, 0x00, 0x00, 0x00, 0x64])
    # Heads 2-4: zeroed
    payload.extend([0x04] * (9 * 3)) # Disabled mode
    # Tail: [target1=50, target2=0, target3=0, target4=0, flag=1]
    payload.extend([0x32, 0x00, 0x00, 0x00, 0x01])
    
    status = parse_doser_payload(bytes(payload))
    
    assert status.response_mode == 0xFE
    assert status.hour == 10
    assert status.minute == 30
    assert len(status.heads) == 4
    assert status.heads[0].mode == 0
    assert status.heads[0].dosed_ml() == 10.0
    assert status.tail_targets[0] == 50
    assert status.tail_flag == 1

def test_parse_doser_lifetime_1e():
    """Test parsing 0x1E lifetime payload."""
    # Example payload for 0x1E: [5B, 00, 01, 00, 01, 1E, ...4x2B...]
    payload = bytearray([0x5B, 0x00, 0x01, 0x00, 0x01, 0x1E])
    # Head 1: 5000 (500.0ml)
    payload.extend([0x13, 0x88])
    # Head 2: 1000 (100.0ml)
    payload.extend([0x03, 0xE8])
    # Head 3 & 4: 0
    payload.extend([0x00, 0x00, 0x00, 0x00])
    
    status = parse_doser_payload(bytes(payload))
    
    assert status.response_mode == 0x1E
    assert status.lifetime_totals_ml() == [500.0, 100.0, 0.0, 0.0]
    assert status.heads == []
