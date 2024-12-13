import { Switch, Route } from "wouter";
import { Home } from "./pages/Home";
import { Player } from "./pages/Player";
import { Login } from "./pages/Login";
import { AdminDashboard } from "./pages/AdminDashboard";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/watch/:channelId" component={Player} />
        <Route path="/login" component={Login} />
        <Route path="/admin" component={AdminDashboard} />
        <Route>Page non trouvée</Route>
      </Switch>
    </div>
  );
}

export default App;
