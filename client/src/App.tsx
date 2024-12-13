import { Switch, Route } from "wouter";
import { Home } from "./pages/Home";
import { Player } from "./pages/Player";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/watch/:channelId" component={Player} />
        <Route>Page non trouvée</Route>
      </Switch>
    </div>
  );
}

export default App;
