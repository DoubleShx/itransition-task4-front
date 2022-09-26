import httpClient from "../axios/axios";

export const debounce = (fn, ms) => {
    let timeout;
    return function () {
      const fnCall = () => {
        fn.apply(this, arguments);
      };
      clearTimeout(timeout);
      timeout = setTimeout(fnCall, ms);
    };
  };

  const FilterTableFetch = (
    url, page, per_page=20, extraParams, returnFunction
  ) => {
    const { extraOptions: _, ...params } = extraParams
    console.log(url, 'page', page, 'per_page', per_page, 'extraparams', extraParams, 'returnFunction', returnFunction)
    // change per page here
    httpClient.get(
      url,{
      params: {
        ...params,
        per_page,
        paginate: 1,
        page,
      },
    })
      .then((response) => {
        returnFunction(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

export const TableSearchByDebounce = debounce(
  (url, page, per_page, extraParams, returnFunction) => {
    FilterTableFetch(url, page, per_page, extraParams, returnFunction);
  },
  600
);

const SingleGetData = (link, params, callback) => {
  console.log('single data get')
  httpClient.get(link + params.id)
      .then(res => {
        callback(res)
      })
      .catch(err => console.log(err))
}

export const debouncedSingleGetData = debounce(
  (link, params, callback) => {
    SingleGetData(link, params, callback)
  },
  1500
);