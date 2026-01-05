type ApiSlice = { util?: { resetApiState: () => any } };

export const invalidateAllTags = (apis: ApiSlice[]) => {
  return (store: any) => {
    return (next: any) => {
      return (action: any) => {
        const type = action.type;
        const isAuthReset = type === 'auth/clearAuthInfo';

        if (isAuthReset) {
          apis.forEach((api) => {
            if (api?.util?.resetApiState) {
              store.dispatch(api.util.resetApiState());
            }
          });
        }

        return next(action);
      };
    };
  };
};
