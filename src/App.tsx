import InstrumentBar from './components/InstrumentBar'
import Hero from './components/Hero'
import Modules from './components/Modules'
import Spec from './components/Spec'
import Terminal from './components/Terminal'

export default function App() {
  return (
    <>
      <InstrumentBar />
      {/* data-zone tells the instrument bar whether it is over a paper or ink block. */}
      <main>
        <div data-zone="paper">
          <Hero />
        </div>
        <div data-zone="paper">
          <Modules />
        </div>
        <div data-zone="ink">
          <Spec />
        </div>
        <div data-zone="paper">
          <Terminal />
        </div>
      </main>
    </>
  )
}
