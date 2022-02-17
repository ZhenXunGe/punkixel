import { World } from "./draw";

interface WorldState {
    world: World;
}

const initialState: WorldState = {
    world: new World(0),
};