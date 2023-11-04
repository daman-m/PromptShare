import '@styles/globals.css';
import Nav from '@comps/Nav';
import Provider from '@comps/Provider';

export const metadata = {
    title: "PromptShare",
    description:"Discover & Share AI Prompts"
}

const RootLayout = ({children}) => {
  return (
    <html lang='en'>
        <body>
            <div className='main'>
                <div className='gradient'/>
            </div>
            <main className='app'>
                <Nav/>
                {children}
            </main>
        </body>
    </html>
  )
}

export default RootLayout