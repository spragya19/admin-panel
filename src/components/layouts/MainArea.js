import { Main, DrawerHeader } from "../utils"


const MainArea = ({open, children}) => {
  return (
    <Main open={open}>
      <DrawerHeader />
      {children}
    </Main>
  )
}

export default MainArea