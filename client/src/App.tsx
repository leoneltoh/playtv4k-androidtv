import { Switch, Route } from "wouter";
import { Home } from "./pages/Home";
import { Player } from "./pages/Player";
import { PiPPlayer } from "./components/PiPPlayer";
import { usePiPMode } from "./hooks/usePiPMode";

function App() {
  const { isOpen, currentUrl } = usePiPMode();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/watch/:channelId" component={Player} />
        <Route>Page non trouvée</Route>
      </Switch>
      
      {currentUrl && (
        <PiPPlayer 
          url={currentUrl} 
          isOpen={isOpen} 
          onClose={() => {
            usePiPMode.getState().setIsOpen(false);
            usePiPMode.getState().setCurrentUrl(null);
          }} 
        />
      )}
    </div>
  );
}

export default App;
