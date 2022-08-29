import { RestEndpoint } from "servicehelper";

export const punkixelEndpoint = new RestEndpoint(`http://${window.location.hostname}:4000/punkixel/`, "punkixel", "punkixel");



