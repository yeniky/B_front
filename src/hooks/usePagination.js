// import React from 'react';
import useSWR from 'swr';
import { useReducer, useEffect } from 'react';

const emptyArray = [];

// const usePagination = (fetcher, page, per_page) => {
//   const { data, error } = useSWR([page, per_page], fetcher);

//   return {
//     items: data?.items || emptyArray,
//     page: +data?.page,
//     per_page: +data?.per_page,
//     total: +data?.total,
//     total_pages: +data?.total_pages,
//     error,
//     isLoading: !error && !data,
//   };
// };

const init = ({ initial_page, initial_page_size }) => ({
  items: emptyArray,
  page: initial_page,
  per_page: initial_page_size,
  total: 0,
  total_pages: 0,
  has_next: false,
  order_by: 'id',
  order: 'asc',
});

const reducer = (state, action) => {
  switch (action.type) {
    case 'set_page':
      return {
        ...state,
        page: action.payload.page,
      };
    case 'set_per_page':
      return {
        ...state,
        page: 1,
        per_page: action.payload.per_page,
      };
    case 'next_page':
      return {
        ...state,
        page: Math.min(
          state.page + 1,
          state.total_pages >= 0 ? state.total_pages : Number.MAX_VALUE
        ),
      };
    case 'previous_page':
      return {
        ...state,
        page: Math.max(state.page - 1, 1),
      };
    case 'set_page_info':
      return {
        // ...state,
        ...action.payload.pageInfo,
      };
    case 'set_order_by':
      return {
        ...state,
        order_by: action.payload.order_by,
      };
    case 'set_order':
      return {
        ...state,
        order: action.payload.order,
      };
    case 'set_order_options':
      return {
        ...state,
        order: action.payload.order,
        order_by: action.payload.order_by,
      };
    default:
      break;
  }
};

const usePagination = (fetcher, initial_page = 1, initial_page_size = 10) => {
  const [pageInfo, dispatch] = useReducer(
    reducer,
    { initial_page, initial_page_size },
    init
  );

  const {
    items,
    page,
    per_page,
    total,
    total_pages,
    has_next,
    order_by,
    order,
  } = pageInfo;

  // console.log(pageInfo);

  // console.log([fetcher.name, page, per_page, order_by, order]);

  const { data: d, error: e, mutate } = useSWR(
    [fetcher.name, page, per_page, order_by, order],
    (f_name, page, per_page, order_by, order) =>
      fetcher(page, per_page, order_by, order),
    {
      revalidateOnMount: true,
      revalidateOnReconnect: true,
      revalidateOnFocus: true,
    }
  );

  useEffect(() => {
    if (d) {
      dispatch({ type: 'set_page_info', payload: { pageInfo: d } });
    }
  }, [d, page, per_page]);

  const nextPage = () => {
    if (has_next) {
      dispatch({ type: 'next_page' });
    }
  };

  const previousPage = () => {
    if (page > 1) {
      dispatch({ type: 'previous_page' });
    }
  };

  const setPage = (page) => {
    if (page > 0 && page <= total_pages) {
      dispatch({ type: 'set_page', payload: { page } });
    }
  };

  const setPageSize = (pageSize) => {
    if (pageSize > 0 && pageSize <= 50) {
      dispatch({ type: 'set_per_page', payload: { per_page: pageSize } });
    }
  };

  const setOrderBy = (order_by, order = 'asc') => {
    // if (order_by !== '') {
    // dispatch({ type: 'set_order_by', payload: { order_by } });
    // }
    // dispatch({ type: 'set_order', payload: { order } });
    dispatch({ type: 'set_order_options', payload: { order_by, order } });
  };

  return {
    items: items,
    page: page,
    per_page: per_page,
    total: total,
    total_pages: total_pages,
    order_by: order_by,
    order: order,
    has_next: has_next,
    error: e,
    isLoading: !d && !e,
    actions: {
      nextPage,
      previousPage,
      setPage,
      setPageSize,
      setOrderBy,
    },
    mutate,
  };
};

export default usePagination;
