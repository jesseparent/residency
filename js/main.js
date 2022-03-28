let Sim;
let sim;

if (window.Sim) {
	Sim = window.Sim.default;

	sim = new Sim({
		triggerMap: {
			"r01": { nextView: "r02", triggerID: "deploy" },
      "r02": { nextView: "r03", triggerID: "network-performance" },
      "r03": { nextView: "r04", triggerID: "virtualization" },
      "r04": { nextView: "r05", triggerID: "streamline" }
		},
		// Options you can provide to override zoom strategy for the container
		options: {
			zoomStrategy: 4,
			noZoom: false
		}
	})
}
