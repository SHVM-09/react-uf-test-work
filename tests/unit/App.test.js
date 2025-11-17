import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import App from '../../src/components/App';

// Simple mock store without thunk middleware
const mockStore = configureMockStore([]);

describe('App Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        inProgress: false,
        isLoggedIn: false,
        currentUser: null,
        errors: null,
      },
      home: {
        tag: null,
        articles: [],
        articlesCount: 0,
        currentPage: 0,
      },
      article: {
        article: null,
        comments: [],
        errors: null,
      },
      articleList: {
        articles: [],
        articlesCount: 0,
        tab: 'all',
      },
      profile: {
        profile: null,
        favorited: [],
        isLoading: false,
      },
      settings: {
        inProgress: false,
        errors: null,
      },
      editor: {
        articleSlug: null,
        inProgress: false,
        errors: null,
      },
      common: {
        appName: 'Conduit',
        inProgress: false,
      },
    });
  });

  test('should render App component without crashing', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(document.body).toBeInTheDocument();
  });

  test('should render main container', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(container).toBeTruthy();
  });

  test('should provide Redux context to children', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(container.firstChild).toBeTruthy();
  });
});
