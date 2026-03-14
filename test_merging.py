"""Test script for DoserStatus.update_from merging logic."""

from custom_components.aquable.device_control.status_parser import DoserStatus, HeadSnapshot

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
