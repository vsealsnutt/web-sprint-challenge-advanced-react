import React from 'react';
import AppClass from './AppClass';
import { render, screen, fireEvent } from '@testing-library/react';

// Write your tests here
test('sanity', () => {
  expect(true).toBe(false)
})

test('renders without errors', () => {
  render (<AppClass />);
})

test('direction buttons render', () => {
  render (<AppClass />);

  const leftButton = screen.queryByText('LEFT');
  const rightButton = screen.queryByText('RIGHT');
  const upButton = screen.queryByText('UP');
  const downButton = screen.queryByText('DOWN');
  const resetButton = screen.queryByText('reset');

  expect(leftButton).toBeInTheDocument();
  expect(rightButton).toBeInTheDocument();
  expect(upButton).toBeInTheDocument();
  expect(downButton).toBeInTheDocument();
  expect(resetButton).toBeInTheDocument();
})

test('can type email in input', () => {
  render(<AppClass />);

  const formInput = screen.getByRole('email');

  fireEvent.change(formInput, 'v@sealsnutt.com');

  expect(formInput).toHaveValue('v@sealsnutt.com');
})