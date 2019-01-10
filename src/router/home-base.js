export default {
  meta: {
    requiresAuth: true
  },
  name: "default",
  path: "/",
  component: require("../modules/home/home"),
  children: []
}