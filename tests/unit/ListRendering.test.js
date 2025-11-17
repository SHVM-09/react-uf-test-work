import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

/**
 * ListRendering Component for testing
 * Renders a list of items with the ability to add and remove items
 */
const ListRendering = ({ items = [] }) => {
  const [listItems, setListItems] = React.useState(items);
  const [inputValue, setInputValue] = React.useState('');

  const addItem = () => {
    if (inputValue.trim()) {
      setListItems([...listItems, { id: Date.now(), text: inputValue }]);
      setInputValue('');
    }
  };

  const removeItem = (id) => {
    setListItems(listItems.filter(item => item.id !== id));
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter item"
        data-testid="item-input"
      />
      <button onClick={addItem} data-testid="add-btn">Add Item</button>
      
      {listItems.length === 0 ? (
        <p data-testid="empty-message">No items in the list</p>
      ) : (
        <ul data-testid="item-list">
          {listItems.map(item => (
            <li key={item.id} data-testid={`item-${item.id}`}>
              <span>{item.text}</span>
              <button
                onClick={() => removeItem(item.id)}
                data-testid={`remove-btn-${item.id}`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

describe('ListRendering Component', () => {
  
  describe('Empty List Rendering', () => {
    test('should render empty message when list is empty', () => {
      render(<ListRendering items={[]} />);
      const emptyMessage = screen.getByTestId('empty-message');
      expect(emptyMessage).toBeInTheDocument();
      expect(emptyMessage).toHaveTextContent('No items in the list');
    });

    test('should not render list when items array is empty', () => {
      render(<ListRendering items={[]} />);
      const itemList = screen.queryByTestId('item-list');
      expect(itemList).not.toBeInTheDocument();
    });

    test('should display input and add button on empty list', () => {
      render(<ListRendering items={[]} />);
      expect(screen.getByTestId('item-input')).toBeInTheDocument();
      expect(screen.getByTestId('add-btn')).toBeInTheDocument();
    });
  });

  describe('Multiple Items Rendering', () => {
    test('should render multiple items correctly', () => {
      const items = [
        { id: 1, text: 'Item 1' },
        { id: 2, text: 'Item 2' },
        { id: 3, text: 'Item 3' }
      ];
      render(<ListRendering items={items} />);
      
      const itemList = screen.getByTestId('item-list');
      expect(itemList).toBeInTheDocument();
      
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(3);
    });

    test('should display all items with correct text', () => {
      const items = [
        { id: 1, text: 'First Item' },
        { id: 2, text: 'Second Item' },
        { id: 3, text: 'Third Item' }
      ];
      render(<ListRendering items={items} />);
      
      expect(screen.getByText('First Item')).toBeInTheDocument();
      expect(screen.getByText('Second Item')).toBeInTheDocument();
      expect(screen.getByText('Third Item')).toBeInTheDocument();
    });

    test('should render remove button for each item', () => {
      const items = [
        { id: 1, text: 'Item 1' },
        { id: 2, text: 'Item 2' },
        { id: 3, text: 'Item 3' }
      ];
      render(<ListRendering items={items} />);
      
      const removeButtons = screen.getAllByRole('button');
      const removeOnlyButtons = removeButtons.filter(btn => btn.textContent === 'Remove');
      expect(removeOnlyButtons).toHaveLength(3);
    });

    test('should not show empty message when items exist', () => {
      const items = [{ id: 1, text: 'Item 1' }];
      render(<ListRendering items={items} />);
      
      const emptyMessage = screen.queryByTestId('empty-message');
      expect(emptyMessage).not.toBeInTheDocument();
    });
  });

  describe('Dynamic Updates - Adding Items', () => {
    test('should add item when add button is clicked', async () => {
      render(<ListRendering items={[]} />);
      
      const input = screen.getByTestId('item-input');
      const addButton = screen.getByTestId('add-btn');
      
      fireEvent.change(input, { target: { value: 'New Item' } });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText('New Item')).toBeInTheDocument();
      });
    });

    test('should clear input field after adding item', async () => {
      render(<ListRendering items={[]} />);
      
      const input = screen.getByTestId('item-input');
      const addButton = screen.getByTestId('add-btn');
      
      fireEvent.change(input, { target: { value: 'New Item' } });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(input).toHaveValue('');
      });
    });

    test('should not add empty or whitespace-only items', async () => {
      render(<ListRendering items={[]} />);
      
      const input = screen.getByTestId('item-input');
      const addButton = screen.getByTestId('add-btn');
      
      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('empty-message')).toBeInTheDocument();
      });
    });

    test('should add multiple items sequentially', async () => {
      render(<ListRendering items={[]} />);
      
      const input = screen.getByTestId('item-input');
      const addButton = screen.getByTestId('add-btn');
      
      fireEvent.change(input, { target: { value: 'First' } });
      fireEvent.click(addButton);
      
      fireEvent.change(input, { target: { value: 'Second' } });
      fireEvent.click(addButton);
      
      fireEvent.change(input, { target: { value: 'Third' } });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        const listItems = screen.getAllByRole('listitem');
        expect(listItems).toHaveLength(3);
        expect(screen.getByText('First')).toBeInTheDocument();
        expect(screen.getByText('Second')).toBeInTheDocument();
        expect(screen.getByText('Third')).toBeInTheDocument();
      });
    });
  });

  describe('Dynamic Updates - Removing Items', () => {
    test('should remove item when remove button is clicked', async () => {
      const items = [
        { id: 1, text: 'Item 1' },
        { id: 2, text: 'Item 2' }
      ];
      render(<ListRendering items={items} />);
      
      const removeButton = screen.getByTestId('remove-btn-1');
      fireEvent.click(removeButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
      });
    });

    test('should show empty message after removing all items', async () => {
      const items = [{ id: 1, text: 'Item 1' }];
      render(<ListRendering items={items} />);
      
      const removeButton = screen.getByTestId('remove-btn-1');
      fireEvent.click(removeButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('empty-message')).toBeInTheDocument();
        expect(screen.queryByTestId('item-list')).not.toBeInTheDocument();
      });
    });

    test('should remove only the specified item', async () => {
      const items = [
        { id: 1, text: 'Item 1' },
        { id: 2, text: 'Item 2' },
        { id: 3, text: 'Item 3' }
      ];
      render(<ListRendering items={items} />);
      
      const removeButton = screen.getByTestId('remove-btn-2');
      fireEvent.click(removeButton);
      
      await waitFor(() => {
        const listItems = screen.getAllByRole('listitem');
        expect(listItems).toHaveLength(2);
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
        expect(screen.getByText('Item 3')).toBeInTheDocument();
      });
    });
  });

  describe('Complex Dynamic Scenarios', () => {
    test('should handle add and remove operations in sequence', async () => {
      const items = [
        { id: 1, text: 'Initial Item' }
      ];
      render(<ListRendering items={items} />);
      
      const input = screen.getByTestId('item-input');
      const addButton = screen.getByTestId('add-btn');
      
      fireEvent.change(input, { target: { value: 'Added Item' } });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText('Added Item')).toBeInTheDocument();
      });
      
      const removeButton = screen.getByTestId('remove-btn-1');
      fireEvent.click(removeButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Initial Item')).not.toBeInTheDocument();
        expect(screen.getByText('Added Item')).toBeInTheDocument();
      });
    });

    test('should maintain list integrity with rapid operations', async () => {
      render(<ListRendering items={[]} />);
      
      const input = screen.getByTestId('item-input');
      const addButton = screen.getByTestId('add-btn');
      
      for (let i = 1; i <= 5; i++) {
        fireEvent.change(input, { target: { value: `Item ${i}` } });
        fireEvent.click(addButton);
      }
      
      await waitFor(() => {
        const listItems = screen.getAllByRole('listitem');
        expect(listItems).toHaveLength(5);
      });
    });

    test('should update list correctly after removing and adding items', async () => {
      const items = [
        { id: 1, text: 'Item 1' },
        { id: 2, text: 'Item 2' },
        { id: 3, text: 'Item 3' }
      ];
      render(<ListRendering items={items} />);
      
      const removeButton = screen.getByTestId('remove-btn-2');
      fireEvent.click(removeButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
      });
      
      const input = screen.getByTestId('item-input');
      const addButton = screen.getByTestId('add-btn');
      fireEvent.change(input, { target: { value: 'New Item' } });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        const listItems = screen.getAllByRole('listitem');
        expect(listItems).toHaveLength(3);
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 3')).toBeInTheDocument();
        expect(screen.getByText('New Item')).toBeInTheDocument();
      });
    });
  });
});
