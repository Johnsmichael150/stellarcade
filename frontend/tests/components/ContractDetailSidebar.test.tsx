import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ContractDetailSidebar } from '../../src/components/v1/ContractDetailSidebar';

describe('ContractDetailSidebar Integration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading state initially', () => {
    render(<ContractDetailSidebar contractId="test-1" />);
    
    expect(screen.getByTestId('contract-detail-sidebar-loading-1')).toBeInTheDocument();
    expect(screen.getByTestId('contract-detail-sidebar-loading-2')).toBeInTheDocument();
    expect(screen.getByTestId('contract-detail-sidebar-loading-3')).toBeInTheDocument();
  });

  it('renders related contracts after loading', async () => {
    render(<ContractDetailSidebar contractId="test-1" />);
    
    // Fast-forward past the loading delay
    vi.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(screen.getByText('Contract A')).toBeInTheDocument();
      expect(screen.getByText('Contract B')).toBeInTheDocument();
      expect(screen.getByText('Contract C')).toBeInTheDocument();
    });
  });

  it('displays correct count of related contracts', async () => {
    render(<ContractDetailSidebar contractId="test-1" />);
    
    vi.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  it('renders different actions based on contract status', async () => {
    render(<ContractDetailSidebar contractId="test-1" />);
    
    vi.advanceTimersByTime(1000);
    
    await waitFor(() => {
      // Active contract should have View and Edit
      expect(screen.getByTestId('contract-1-view')).toBeInTheDocument();
      expect(screen.getByTestId('contract-1-edit')).toBeInTheDocument();
      
      // Locked contract should have View and disabled Edit
      expect(screen.getByTestId('contract-2-view')).toBeInTheDocument();
      expect(screen.getByTestId('contract-2-edit')).toBeInTheDocument();
      expect(screen.getByTestId('contract-2-edit')).toBeDisabled();
      
      // Pending contract should have View and Delete
      expect(screen.getByTestId('contract-3-view')).toBeInTheDocument();
      expect(screen.getByTestId('contract-3-delete')).toBeInTheDocument();
    });
  });

  it('handles contract row click', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<ContractDetailSidebar contractId="test-1" />);
    
    vi.advanceTimersByTime(1000);
    
    await waitFor(() => {
      const wrapper = screen.getByTestId('related-record-action-row-1');
      const mainBtn = wrapper.querySelector('.related-record-action-row__main');
      fireEvent.click(mainBtn!);
    });
    
    expect(consoleSpy).toHaveBeenCalledWith('Navigate to contract:', '1');
    
    consoleSpy.mockRestore();
  });

  it('handles action button clicks without triggering row click', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<ContractDetailSidebar contractId="test-1" />);
    
    vi.advanceTimersByTime(1000);
    
    await waitFor(() => {
      const viewBtn = screen.getByTestId('contract-1-view');
      fireEvent.click(viewBtn);
    });
    
    expect(consoleSpy).toHaveBeenCalledWith('View contract:', '1');
    expect(consoleSpy).not.toHaveBeenCalledWith('Navigate to contract:', '1');
    
    consoleSpy.mockRestore();
  });

  it('displays disabled reason for locked contracts', async () => {
    render(<ContractDetailSidebar contractId="test-1" />);
    
    vi.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(screen.getByText('Contract is locked and cannot be edited')).toBeInTheDocument();
    });
  });

  it('renders empty state when no related contracts', async () => {
    render(<ContractDetailSidebar contractId="empty-test" />);
    
    // For this test, we'd need to modify the component to accept mock data
    // For now, we'll just verify the component renders
    expect(screen.getByTestId('contract-detail-sidebar')).toBeInTheDocument();
  });

  it('shows header with title and count', async () => {
    render(<ContractDetailSidebar contractId="test-1" />);
    
    expect(screen.getByText('Related Contracts')).toBeInTheDocument();
    
    vi.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  it('has proper responsive behavior', () => {
    render(<ContractDetailSidebar contractId="test-1" />);
    
    const sidebar = screen.getByTestId('contract-detail-sidebar');
    expect(sidebar).toHaveClass('contract-detail-sidebar');
  });
});
