import React from 'react'

const AppContext = React.createContext({
    value: {},
    setValue: (value: any) => {}
});

export const useAppContext = () => React.useContext(AppContext);

export default function AppProvider({children, values}: {children: React.ReactNode, values: any}) {
  return (
    <AppContext.Provider value={values}>
      {children}
    </AppContext.Provider>
  )
}