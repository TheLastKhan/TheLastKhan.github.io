// Accordion functionality
function toggleAccordion(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector(".fa-chevron-right"); // Updated selector
    const isActive = header.classList.contains("active");

    // Close all other accordions in the same sidebar
    header
        .closest(".sidebar")
        .querySelectorAll(".accordion-content.active")
        .forEach((item) => {
            if (item !== content) {
                item.classList.remove("active");
                item.previousElementSibling.classList.remove("active");
                const otherIcon = item.previousElementSibling.querySelector(".fa-chevron-right");
                if (otherIcon) otherIcon.style.transform = "rotate(0deg)";
            }
        });

    // Toggle current accordion
    content.classList.toggle("active", !isActive);
    header.classList.toggle("active", !isActive);
    if (icon) {
        icon.style.transform = !isActive ? "rotate(90deg)" : "rotate(0deg)";
    }
}

// Content loading functionality
function loadContent(contentId) {
    const mainContent = document.getElementById("main-content");

    // Show loading indicator
    mainContent.innerHTML = `<div class="loading-indicator"><i class="fas fa-spinner"></i> Loading content...</div>`;

    // Remove active class from all accordion items
    document.querySelectorAll(".accordion-content li").forEach((item) => {
        item.classList.remove("active");
    });

    // Add active class to the clicked item
    const clickedItem = document.querySelector(
        `.accordion-content li[onclick="loadContent(\'${contentId}\')"]`
    );
    if (clickedItem) {
        clickedItem.classList.add("active");
    }

    // Simulate network delay for realism (optional)
    setTimeout(() => {
        const contentData = contentTemplates[contentId];
        const content = contentData
            ? generateProblemContent(contentData)
            : generateNotFoundContent(contentId);

        mainContent.innerHTML = content;

        // Re-apply scroll-based animations to newly loaded content
        observeNewContent(mainContent);

        // Initialize tabs if they exist in the loaded content
        initializeTabs(mainContent);

        // Initialize slideshow if screenshots are available for the current content
        if (contentData && contentData.screenshots && contentData.screenshots.length > 0) {
            // Ensure slideshow containers exist before calling addSlides
            if (
                document.getElementById("slideshowContainer") &&
                document.getElementById("dotsContainer")
            ) {
                addSlides(contentData.screenshots);
            }
        } else {
            // Clear any previous slideshow if no new screenshots
            const slideshowContainer = document.getElementById("slideshowContainer");
            const dotsContainer = document.getElementById("dotsContainer");
            if (slideshowContainer) {
                const prevButton = slideshowContainer.querySelector(".prev");
                const nextButton = slideshowContainer.querySelector(".next");
                slideshowContainer.innerHTML = ""; // Clear all children
                if (prevButton) slideshowContainer.appendChild(prevButton); // Re-add prev button
                if (nextButton) slideshowContainer.appendChild(nextButton); // Re-add next button
            }
            if (dotsContainer) {
                dotsContainer.innerHTML = ""; // Clear dots
            }
        }
    }, 250);
}

// Centralized Content Templates
const contentTemplates = {
    // --- L1 Content --- 
    ...{
        'l1-missing-cable': {
            title: 'L1 - Missing Cable / Unplugged Cable',
            icon: 'fa-unlink',
            definition: 'Devices cannot communicate due to missing or disconnected cables. Red dots appear on interfaces in Packet Tracer indicating no physical connection.',
            causes: [
                'Cable not connected between devices',
                'Loose cable connections',
                'Wrong port selection during cable connection',
                'Cable accidentally removed'
            ],
            steps: [
                'Visual Inspection: Look for red dots on device interfaces',
                'Physical Connectivity Check: Verify cables are properly connected',
                'Interface Status Check: Use CLI commands to verify interface status, as demonstrated in the <b>Terminal Commands</b> section',
                'Cable Connection: Connect appropriate cable between devices',
                'Select the appropriate cable in the Connections section (use a Copper Straight-Through cable for PC-Switch, PC-Router, or Router-Switch connections)',
                'Click on PC\'s interface (e.g., FastEthernet0)',
                'Click on Switch\'s interface (e.g., FastEthernet0/1)',
                'Wait for interfaces to turn green',
                'Test connectivity with Simple PDU'
            ],
            verification: [
                'Visual: Green lights on both device interfaces',
                'CLI: Interface status shows "up/up"',
                'Connectivity: Successful ping between devices'
            ],
            commands: [
                'Switch1> enable',
                'Switch1# show interfaces status',
                'Switch1# show mac address-table',
                'PC1> ping 192.168.1.2 // Switch1 IP',
                'PC1> ping 192.168.2.10 // PC2 IP',
                'Router1> enable // (Optional)',
                'Router1# show ip interface brief // (Optional)',
                'Router1# show interfaces // (Optional)',
                'PC1> ping 192.168.1.1 // Router1 IP (Optional)'
            ],
            simulation: 'Use Simple PDU in Packet Tracer to test connectivity. Check interface lights (should be green when properly connected).',
            simulation_pkt: 'L1PhysicalLayer/l1-missing-cable/l1-missing-cable.pkt', // Placeholder link
            screenshots: [ // Example screenshots
                { src: 'L1PhysicalLayer/l1-missing-cable/l1-missing-cable-ss1.png', caption: 'Physical Connectivity Check: Devices cannot communicate due to missing or disconnected cables.' },
                { src: 'L1PhysicalLayer/l1-missing-cable/l1-missing-cable-ss2.png', caption: 'Connectivity Check: Ping between devices.' },
                { src: 'L1PhysicalLayer/l1-missing-cable/l1-missing-cable-ss3.png', caption: 'Interface Status Check: Use CLI commands to verify interface status, as demonstrated in the Terminal Commands section.' },
                { src: 'L1PhysicalLayer/l1-missing-cable/l1-missing-cable-ss4.png', caption: 'Correct Cable Type Check: Select the appropriate cable in the Connections section. (use a Copper Straight-Through cable for PC-Switch, PC-Router, or Router-Switch connections).' },
                { src: 'L1PhysicalLayer/l1-missing-cable/l1-missing-cable-ss5.png', caption: 'Status Verification: Confirm green LED indicators on both device interfaces.' },
                { src: 'L1PhysicalLayer/l1-missing-cable/l1-missing-cable-ss6.png', caption: 'Interface Status Check: Use CLI commands to verify interface status, as demonstrated in the Terminal Commands section.' },
                { src: 'L1PhysicalLayer/l1-missing-cable/l1-missing-cable-ss7.png', caption: 'Connectivity Check: Ping between devices.' }
            ]
        },
        'l1-wrong-cable': {
            title: 'L1 - Wrong Cable Type',
            icon: 'fa-random',
            definition: 'Devices connected but cannot communicate due to incorrect cable type selection. Orange dots may appear indicating wrong cable type.',
            causes: [
                'Using crossover cable instead of straight-through',
                'Using straight-through cable instead of crossover',
                'Using wrong cable for specific device connections (Serial, Console, etc.)'
            ],
            steps: [
                'Cable Type Check: Identify the cable type used',
                'Cable Selection Rules: <br> Router ↔ Switch: Straight-Through <br> Switch ↔ PC: Straight-Through <br> Router ↔ Router: Crossover <br> Switch ↔ Switch: Crossover (older switches) <br> Switch ↔ Switch: Straight-Through (modern switches with Auto-MDIX) <br> PC ↔ PC: Crossover',
                'Device Type Analysis: Determine if devices are like-to-like or unlike',
                'Auto-MDIX Status: Check if auto-negotiation is enabled',
                'Interface Status Check: Use CLI commands to verify interface status, as demonstrated in the <b>Terminal Commands</b> section',
                'Click on existing cable to select it',
                'Replace Cable: Remove wrong cable and install correct type',
                'Press Delete to remove wrong cable',
                'Select correct cable type from connection options',
                'Connect devices with proper cable',
                'Wait for green interface lights',
                'Test with Simple PDU'
            ],
            verification: [
                'Interface lights turn green',
                'Interface status shows "up/up"',
                'Successful packet transmission'
            ],
            commands: [
                'Switch1> enable',
                'Switch1# show interfaces status',
                'Switch1# show mac address-table',
                'PC1> ping 192.168.1.2 // Switch1 IP',
                'PC1> ping 192.168.2.10 // PC2 IP',
                'Router1> enable // (Optional)',
                'Router1# show ip interface brief // (Optional)',
                'Router1# show interfaces // (Optional)',
                'PC1> ping 192.168.1.1 // Router1 IP (Optional)'
            ],
            simulation: 'Connect unlike devices (e.g., pc and switch) with a crossover cable and observe the link status. Replace with a straight-through cable and observe the change.',
            simulation_pkt: 'L1PhysicalLayer/l1-wrong-cable-type/l1-wrong-cable-type.pkt',
            screenshots: [
                { src: 'L1PhysicalLayer/l1-wrong-cable-type/l1-wrong-cable-type-ss1.png', caption: 'Cable Type Check: Devices connected but cannot communicate due to incorrect cable type selection.' },
                { src: 'L1PhysicalLayer/l1-wrong-cable-type/l1-wrong-cable-type-ss2.png', caption: 'Connectivity Check: Ping between devices.' },
                { src: 'L1PhysicalLayer/l1-wrong-cable-type/l1-wrong-cable-type-ss3.png', caption: 'Interface Status Check: Use CLI commands to verify interface status, as demonstrated in the Terminal Commands section.' },
                { src: 'L1PhysicalLayer/l1-wrong-cable-type/l1-wrong-cable-type-ss4.png', caption: 'Correct Cable Type Check: Select the appropriate cable in the Connections section. (use a Copper Straight-Through cable for PC-Switch, PC-Router, or Router-Switch connections).' },
                { src: 'L1PhysicalLayer/l1-wrong-cable-type/l1-wrong-cable-type-ss5.png', caption: 'Status Verification: Confirm green LED indicators on both device interfaces.' },
                { src: 'L1PhysicalLayer/l1-wrong-cable-type/l1-wrong-cable-type-ss6.png', caption: 'Interface Status Check: Use CLI commands to verify interface status, as demonstrated in the Terminal Commands section.' },
                { src: 'L1PhysicalLayer/l1-wrong-cable-type/l1-wrong-cable-type-ss7.png', caption: 'Connectivity Check: Ping between devices.' }
            ]
        },
        'l1-device-off': {
            title: 'L1 - Device Powered Off',
            icon: 'fa-power-off',
            definition: 'Network device is not powered on, preventing any network communication. Device appears dim or shows no activity lights.',
            causes: [
                'Device power switch is off',
                'Power cable disconnected',
                'Power supply failure',
                'Device in standby mode'
            ],
            steps: [
                'Power Status: Check device power button in Physical tab',
                'Visual Indicators: Look for power LED status',
                'CLI Access: Attempt to access device console',
                'Click on device in Packet Tracer',
                'Go to Physical tab',
                'Click the power button to turn on',
                'Wait for boot process to complete',
                'Test connectivity with neighboring devices'
            ],
            verification: [
                'Power Status: Check device power button in Physical tab',
                'Visual Indicators: Look for power LED status',
                'CLI Access: Attempt to access device console',
                'Network interfaces become active'
            ],
            commands: [
                'No commands available when device is powered off :)'
            ],
            simulation: 'Power off a device in Packet Tracer and observe its appearance. Then power it back on and wait for it to boot up completely.',
            simulation_pkt: 'L1PhysicalLayer/l1-device-powered-off/l1-device-powered-off.pkt',
            screenshots: [
                { src: 'L1PhysicalLayer/l1-device-powered-off/l1-device-powered-off-ss1.png', caption: 'Network device is not powered on, preventing any network communication.' },
                { src: 'L1PhysicalLayer/l1-device-powered-off/l1-device-powered-off-ss2.png', caption: 'CLI Access: Attempt to access device console.' },                
                { src: 'L1PhysicalLayer/l1-device-powered-off/l1-device-powered-off-ss3.png', caption: 'Go to Physical tab.' },
                { src: 'L1PhysicalLayer/l1-device-powered-off/l1-device-powered-off-ss4.png', caption: 'Click the power button to turn on.' },
                { src: 'L1PhysicalLayer/l1-device-powered-off/l1-device-powered-off-ss5.png', caption: 'CLI Access: Attempt to access device console.' },
                { src: 'L1PhysicalLayer/l1-device-powered-off/l1-device-powered-off-ss6.png', caption: 'Connectivity Check: Ping between devices.' },
                { src: 'L1PhysicalLayer/l1-device-powered-off/l1-device-powered-off-ss7.png', caption: 'Network interfaces become active.' }
            ]
        },
        'l1-interface-disabled': {
            title: 'L1 - Network Interface Disabled (Shut Down)',
            icon: 'fa-ban',
            definition: 'Network interface is administratively shut down, preventing communication even when physically connected. Interface status shows "administratively down".',
            causes: [
                'Interface manually shut down with "shutdown" command',
                'Security policy requiring interface shutdown',
                'Administrative policy enforcement',
                'Maintenance mode activation',
                'Configuration error'
            ],
            steps: [
                'Check Interface Status: Use show commands to identify shut interfaces',
                'Access Interface Configuration: Enter interface config mode',
                'Enable Interface: Use "no shutdown" command',
                'Verify Status: Confirm interface is up and operational',
                'Access device CLI (Router or Switch)',
                'Commands: ...',
                'Enter privileged mode: "enable"',
                'Enter global configuration: "configure terminal"',
                'Enter interface configuration: "interface gigabitethernet 0/0/0"',
                'Enable interface: "no shutdown"',
                'Exit configuration: "exit" and "exit"',
                'Verify: "show ip interface brief"'
            ],
            verification: [
                'Interface status changes from "administratively down" to "up/up"',
                'Interface lights turn green in Packet Tracer',
                'Successful connectivity tests'
            ],
            commands: [
                'Router1> show ip interface brief',
                'Router1> show interfaces gigabitethernet 0/0/0',
                'Router1> enable',
                'Router1# configure terminal',
                'Router1(config)# interface gigabitethernet 0/0/0',
                'Router1(config-if)# no shutdown',
                'Router1(config-if)# exit',
                'Router1(config)# exit',
                'PC1> ping 192.168.1.1 // Router1 IP',
                'PC1> ping 192.168.2.10 // PC2 IP',
            ],
            simulation: 'Shut down an interface on a router and observe the status change. Then enable it with the `no shutdown` command and verify it returns to "up/up" state.',
            simulation_pkt: 'L1PhysicalLayer/l1-network-interface-disabled/l1-network-interface-disabled.pkt',
            screenshots: [
                { src: 'L1PhysicalLayer/l1-network-interface-disabled/l1-network-interface-disabled-ss1.png', caption: 'Network interface is administratively shut down, preventing communication even when physically connected. Interface status shows "administratively down".' },
                { src: 'L1PhysicalLayer/l1-network-interface-disabled/l1-network-interface-disabled-ss2.png', caption: 'Check Interface Status: Use show commands to identify shut interfaces.' },
                { src: 'L1PhysicalLayer/l1-network-interface-disabled/l1-network-interface-disabled-ss3.png', caption: 'Interface status changes from "administratively down" to "up/up.' },
                { src: 'L1PhysicalLayer/l1-network-interface-disabled/l1-network-interface-disabled-ss4.png', caption: 'Connectivity Check: Ping between devices.' },
                { src: 'L1PhysicalLayer/l1-network-interface-disabled/l1-network-interface-disabled-ss5.png', caption: 'Interface lights turn green in Packet Tracer.' }
            ]
        },
        'l1-cable-length': {
            title: 'L1 - Cable Length Exceeded (No PT Simulation)',
            icon: 'fa-ruler-horizontal',
            definition: 'Network cable exceeds maximum distance specifications, causing signal degradation and connection failures. Connection may be intermittent or completely fail.',
            causes: [
                'Ethernet cable longer than 100 meters',
                'Fiber optic cable exceeding distance specifications',
                'Signal attenuation over long distances',
                'No signal repeaters/amplifiers in long runs'
            ],
            steps: [
                'Cable Length Measurement: Check physical cable distance',
                'Signal Quality: Monitor for CRC errors and collisions using "show interfaces" or "show interfaces counters errors"',
                'Performance Testing: Test data transmission rates',
                'Use repeaters or switches to extend distance',
                'Implement fiber optic cables for longer distances',
                'Replace with shorter cables',
                'Move devices closer if possible',
                'Option A - Add Intermediate Switch: <br> Place Switch between distant devices <br> Connect first device to switch (< 100m) <br> Connect switch to second device (< 100m)',
                'Option B - Use Fiber Optic: <br> Remove copper cable <br> Add fiber optic modules to devices <br> Connect with fiber optic cable',
                'Option C - Relocate Devices: <br> Move devices closer together <br> Ensure distance < 100 meters',                
            ],
            verification: [
                'Cable Length Measurement: Check physical cable distance',
                'Signal Quality: Monitor for CRC errors and collisions',
                'Performance Testing: Test data transmission rates'
            ],
            commands: [
                'Router> show ip interface brief',
                'Switch> show interfaces',
                'Switch> show interfaces status',
                'Switch> show interfaces counters errors',
                'Switch> show mac address-table'
            ],
            simulation: 'In Packet Tracer, create a network with devices connected by a very long cable. Observe the connectivity issues and then add a switch or repeater in the middle to resolve the problem.',
            simulation_pkt: '#',
            screenshots: [
                { src: 'L1PhysicalLayer/l1-cable-length- exceeded/l1-cable-length- exceeded-ss1.png', caption: 'Network cable exceeds maximum distance specifications, causing signal degradation and connection failures. Connection may be intermittent or completely fail.' },
                { src: 'L1PhysicalLayer/l1-cable-length- exceeded/l1-cable-length- exceeded-ss2.png', caption: 'Network cable exceeds maximum distance specifications, causing signal degradation and connection failures. Connection may be intermittent or completely fail.' },
                { src: 'L1PhysicalLayer/l1-cable-length- exceeded/l1-cable-length- exceeded-ss3.png', caption: 'Network cable exceeds maximum distance specifications, causing signal degradation and connection failures. Connection may be intermittent or completely fail.' },      
            ]
        },
        'l1-port-failure': {
            title: 'L1 - Port Failure (No PT Simulation)',
            icon: 'fa-heart-broken',
            definition: 'Network interface hardware is damaged or malfunctioning, preventing proper network communication even with correct cables and configuration.',
            causes: [
                'Physical damage to interface port',
                'Hardware failure',
                'Electronic component failure',
                'Electrical issues',
                'Port burned out from power surge',
                'Connector damage or corrosion'
            ],
            steps: [
                'Test Different Ports: Try connecting to alternative interface',
                'Check Interface Statistics: Look for error counters',
                'Replace Interface Module: If modular device',
                'Use Alternative Interface: Configure different port',
                'Replace Device: If built-in interface is damaged',
                'Identify Faulty Interface: <br> Check which interface is not working <br> Note interface name (e.g., GigE0/0)',
                'Use Alternative Interface: <br> Disconnect cable from faulty interface <br> Connect to different working interface (e.g., GigE0/1) <br> Configure new interface with IP settings',
            ],
            verification: [
                'New interface shows "up/up" status',
                'Successful connectivity through alternative port',
                'No error counters on new interface',
                'Normal network communication restored'
            ],
            commands: [
                '// Configure New Interface',
                'Router1(config)# interface gigabitEthernet 0/1',
                'Router1(config-if)# ip address 192.168.1.1 255.255.255.0',
                'Router1(config-if)# no shutdown',
                '// Terminal Commands - Diagnosis',
                'Router1> show interfaces',
                'Router1> show interfaces gigabitEthernet 0/0',
                'Router1> show ip interface brief',
                'Router1> show interfaces summary',            
                '// Terminal Commands - Solution',
                'Router1> enable',
                'Router1# configure terminal',
                'Router1(config)# interface gigabitEthernet 0/1',
                'Router1(config-if)# ip address 192.168.1.1 255.255.255.0', 
                'Router1(config-if)# no shutdown',
                'Router1(config-if)# exit'
            ],
            simulation: 'In Packet Tracer, simulate a faulty port by disconnecting a cable from one port and connecting it to another port. Configure the new port with the same settings as the original port.',
            simulation_pkt: '#',
            screenshots: [
                { src: 'L1PhysicalLayer/l1-port-failure/l1-port-failure-ss1.png', caption: 'Network interface hardware is damaged or malfunctioning, preventing proper network communication even with correct cables and configuration.' },
            ]
        },
        'l1-pc-adapter-disabled': {
            title: 'L1 - PC Network Adapter Disabled',
            icon: 'fa-desktop',
            definition: 'PC\'s network adapter is disabled in operating system settings, preventing network connectivity even when physically connected.',
            causes: [
                'Network adapter disabled in PC settings',
                'Driver issues or conflicts',
                'Hardware failure',
                'Power management settings',
                'Security software blocking adapter'
            ],
            steps: [
                'Click on PC',
                'Navigate to the "Config" tab',
                'From the left menu, select the "Interface" section (e.g., FastEthernet0)',
                'Locate the "Port Status" setting',
                'Select "On"'
            ],
            verification: [
                'Physical Indicator: The port LED on the connected switch/router should turn green',
                'Open the PC\'s Command Prompt',
                'ping 192.168.1.1 (Router\'s IP)'
            ],
            commands: [
                'PC1> ipconfig',
                'PC1> ipconfig /all',
                'PC1> ping 192.168.1.1'
            ],
            simulation: 'In Packet Tracer, disable a PC\'s network adapter and observe the connectivity issues. Then enable the adapter and verify connectivity is restored.',
            simulation_pkt: 'L1PhysicalLayer/l1-pc-network-adapter-disabled/l1-pc-network-adapter-disabled.pkt',
            screenshots: [
                { src: 'L1PhysicalLayer/l1-pc-network-adapter-disabled/l1-pc-network-adapter-disabled-ss1.png', caption: 'PC\'s network adapter is disabled in operating system settings, preventing network connectivity even when physically connected.' },
                { src: 'L1PhysicalLayer/l1-pc-network-adapter-disabled/l1-pc-network-adapter-disabled-ss2.png', caption: 'Network adapter disabled in PC settings.' },
                { src: 'L1PhysicalLayer/l1-pc-network-adapter-disabled/l1-pc-network-adapter-disabled-ss3.png', caption: 'Select "On".' },
                { src: 'L1PhysicalLayer/l1-pc-network-adapter-disabled/l1-pc-network-adapter-disabled-ss4.png', caption: 'Physical Indicator: The port LED on the connected switch/router should turn green.' }
            ]
        },
        'l1-wireless-signal': {
            title: 'L1 - Weak Wireless Signal (No PT Simulation)',
            icon: 'fa-wifi',
            definition: 'Wireless devices experience connectivity issues due to weak signal strength, interference, or distance from access point.',
            causes: [
                'Distance too far from wireless access point',
                'Physical obstacles blocking signal',
                'Interference from other wireless devices',
                'Access point power settings too low',
                'Wrong wireless channel configuration'
            ],
            steps: [
                'Check Signal Strength: Check RSSI values (wireless signal levels)',
                'Distance Testing: Move device closer to AP',
                'Remove Obstacles: Clear line of sight between devices',
                'Adjust Power Settings: Increase access point transmission power',
                'Channel Analysis: Check for channel conflicts',
                'Optimize Placement: Move AP to central location',
                'Channel Selection: Configure non-overlapping channels (1, 6, 11)',
                'Power Adjustment: Increase transmit power if needed using "power local maximum"',
                'Add Additional Access Points: Extend coverage area'
            ],
            verification: [
                'Signal strength shows 3-4 bars (strong signal)',
                'Successful wireless connection establishment',
                'Stable ping responses to gateway',
                'Good data transfer rates',
                'No frequent disconnections'
            ],
            commands: [
                'AP1(config)# interface dot11Radio 0',
                'AP1(config-if)# channel 11',
                'AP1(config-if)# power local maximum',
                'PC1> ipconfig',
                'PC1> ping 192.168.1.1',
                'PC1> ping google.com'
            ],
            simulation: 'In Packet Tracer, place wireless clients at varying distances from an access point and observe signal strength. Change the AP channel and power settings to improve connectivity.',
            simulation_pkt: '#',
            screenshots: [
                { src: 'L1PhysicalLayer/l1-wireless-signal-Interference/l1-wireless-signal-Interference-ss1.png', caption: 'Wireless devices experience connectivity issues due to weak signal strength, interference, or distance from access point.' },
                { src: 'L1PhysicalLayer/l1-wireless-signal-Interference/l1-wireless-signal-Interference-ss2.png', caption: 'Wireless devices experience connectivity issues due to weak signal strength, interference, or distance from access point.' },
                { src: 'L1PhysicalLayer/l1-wireless-signal-Interference/l1-wireless-signal-Interference-ss3.png', caption: 'Wireless devices experience connectivity issues due to weak signal strength, interference, or distance from access point.' },
                { src: 'L1PhysicalLayer/l1-wireless-signal-Interference/l1-wireless-signal-Interference-ss4.png', caption: 'Wireless devices experience connectivity issues due to weak signal strength, interference, or distance from access point.' }
            ]
        }
    },
    // --- L2 Content --- 
    ...{
        'l2-mac-table-empty': {
            title: 'L2 - MAC Address Table Not Populated',
            icon: 'fa-table',
            definition: 'Switch MAC address table is empty or incomplete, causing flooding of unicast traffic and poor network performance. Switch cannot learn device locations properly.',
            causes: [
                'Devices not generating traffic for MAC learning',
                'MAC address table timeout too short',
                'Switch ports in wrong state',
                'Static MAC entries conflicting with dynamic learning',
                'New device recently connected',
                'MAC address aging timeout',
                'Switch reboot clearing MAC table',
                'Unidirectional communication'
            ],
            steps: [
                'Check MAC Address Table: Verify current MAC entries',
                'Generate Traffic: Create communication between devices',
                'Verify Learning: Confirm MAC addresses are learned',
            ],
            verification: [
                'MAC address table shows learned entries',
                'Each PC\'s MAC address associated with correct port',
                'Unicast traffic forwarded efficiently (no flooding)',
                'Show commands display proper MAC-to-port mappings'
            ],
            commands: [
                '// Terminal Commands - Diagnosis',
                'Switch1> enable',
                'Switch1# show mac address-table',
                'Switch1# show mac address-table dynamic',
                'Switch1# show mac address-table interface fastethernet 0/1',
                'Switch1# show interfaces status',        
                '// Terminal Commands - Solution',
                'PC1> ping 192.168.1.2 // Switch1 IP',
                'PC1> ping 192.168.2.10 // PC2 IP',     
                'Switch1> enable',
                'Switch1# show mac address-table',
                'Switch1# show mac address-table dynamic'
            ],
            simulation: 'In Packet Tracer, check a switch\'s MAC address table before and after sending traffic between devices. Observe how the table is populated as devices communicate.',
            simulation_pkt: 'L2DataLinkLayer/l2-mac-address-table-not-populated/l2-mac-address-table-not-populated.pkt',
            screenshots: [
                { src: 'L2DataLinkLayer/l2-mac-address-table-not-populated/l2-mac-address-table-not-populated-ss1.png', caption: 'Check MAC Address Table: Verify current MAC entries.' },
                { src: 'L2DataLinkLayer/l2-mac-address-table-not-populated/l2-mac-address-table-not-populated-ss2.png', caption: 'Generate Traffic: Create communication between devices.' },
                { src: 'L2DataLinkLayer/l2-mac-address-table-not-populated/l2-mac-address-table-not-populated-ss3.png', caption: 'Verify Learning: Confirm MAC addresses are learned.' },
            ]
        },
        'l2-wrong-vlan': {
            title: 'L2 - Incorrect VLAN Assignment',
            icon: 'fa-tags',
            definition: 'Devices assigned to wrong VLANs cannot communicate with intended network segments. Traffic isolation occurs when devices should be in same broadcast domain.',
            causes: [
                'Port assigned to wrong VLAN',
                'Default VLAN configuration issues',
                'VLAN membership misconfiguration',
                'Access port vs trunk port confusion'
            ],
            steps: [
                'Check Current VLAN Assignment: Verify port VLAN membership',
                'Identify Correct VLAN: Determine proper VLAN for device',
                'Reassign Port: Move port to correct VLAN',
                'Verify Configuration: Confirm proper VLAN assignment',
                'Test Connectivity: Ensure devices can communicate'
            ],
            verification: [
                'Learned MAC entries appear in MAC address table',
                'Correct port associations established for each PC MAC address',
                'Efficient unicast forwarding without broadcast flooding',
                'MAC-to-port mappings correctly shown in display commands'
            ],
            commands: [
                '// Terminal Commands - Diagnosis',
                'Switch1> show vlan brief',
                'Switch1> show interfaces switchport',
                'Switch1> show interfaces fastethernet 0/1 switchport',
                'Switch1> show interfaces fastethernet 0/2 switchport',
                'Switch1> show running-config',
                '// Terminal Commands - Solution',                
                'Switch1> enable',
                'Switch1# configure terminal',
                'Switch1(config)# interface fastethernet 0/2',
                'Switch1(config-if)# switchport mode access',
                'Switch1(config-if)# switchport access vlan 10',
                'Switch1(config-if)# exit',
                'Switch1(config)# exit'
            ],
            simulation: 'Create a switch with multiple VLANs in Packet Tracer. Connect devices to different ports and assign them to incorrect VLANs. Observe the communication failure, then correct the VLAN assignments.',
            simulation_pkt: 'L2DataLinkLayer/l2-incorrect-vlan-assignment/l2-incorrect-vlan-assignment.pkt',
            screenshots: [
                { src: 'L2DataLinkLayer/l2-incorrect-vlan-assignment/l2-incorrect-vlan-assignment-ss1.png', caption: 'Test Connectivity: Ensure devices can communicate.' },
                { src: 'L2DataLinkLayer/l2-incorrect-vlan-assignment/l2-incorrect-vlan-assignment-ss2.png', caption: 'Check Current VLAN Assignment: Verify port VLAN membership.' },
                { src: 'L2DataLinkLayer/l2-incorrect-vlan-assignment/l2-incorrect-vlan-assignment-ss3.png', caption: 'Check Current VLAN Assignment: Verify port VLAN membership.' },
                { src: 'L2DataLinkLayer/l2-incorrect-vlan-assignment/l2-incorrect-vlan-assignment-ss4.png', caption: 'Check Current VLAN Assignment: Verify port VLAN membership.' },
                { src: 'L2DataLinkLayer/l2-incorrect-vlan-assignment/l2-incorrect-vlan-assignment-ss5.png', caption: 'Check Current VLAN Assignment: Verify port VLAN membership.' },
                { src: 'L2DataLinkLayer/l2-incorrect-vlan-assignment/l2-incorrect-vlan-assignment-ss6.png', caption: 'Correcting VLAN assignment for a port.' },
                { src: 'L2DataLinkLayer/l2-incorrect-vlan-assignment/l2-incorrect-vlan-assignment-ss7.png', caption: 'Test Connectivity: Ensure devices can communicate.' },
            ]
        },
        'l2-vlan-nonexistent': {
            title: 'L2 - VLAN Does Not Exist',
            icon: 'fa-question-circle',
            definition: 'Attempting to assign ports to non-existent VLANs causes configuration errors. Ports may be assigned to VLAN that was never created on the switch.',
            causes: [
                'VLAN not created on switch',
                'VLAN created on one switch but not others',
                'VLAN accidentally deleted',
                'VLAN database corruption',
                'Configuration not saved'
            ],
            steps: [
                'Check Existing VLANs: List all configured VLANs',
                'Identify Missing VLAN: Determine which VLAN needs creation',
                'Create Missing VLAN: Add VLAN to database',
                'Verify Assignment: Confirm ports properly assigned'
            ],
            verification: [
                'VLAN appears in VLAN table',
                'Ports properly assigned to existing VLANs',
                'No orphaned port assignments',
                'Devices in the same VLAN can communicate'
            ],
            commands: [
                'Switch1> show vlan brief',
                'Switch1> show running-config',
                'Switch1> enable',
                'Switch1# configure terminal',
                'Switch1(config)# vlan 20',
                'Switch1(config-vlan)# exit',
                'Switch1(config)# exit',
                'Switch1# show vlan brief'
            ],
            simulation: 'Try to assign a port to a non-existent VLAN in Packet Tracer and observe the error. Create the VLAN and then successfully assign the port to it.',
            simulation_pkt: 'L2DataLinkLayer/l2-vlan-does-not-exist/l2-vlan-does-not-exist.pkt',
            screenshots: [
                { src: 'L2DataLinkLayer/l2-vlan-does-not-exist/l2-vlan-does-not-exist-ss1.png', caption: 'Attempting to assign ports to non-existent VLANs causes configuration errors. Ports may be assigned to VLAN that was never created on the switch.' },
                { src: 'L2DataLinkLayer/l2-vlan-does-not-exist/l2-vlan-does-not-exist-ss2.png', caption: 'Identify Missing VLAN: Determine which VLAN needs creation.' },
                { src: 'L2DataLinkLayer/l2-vlan-does-not-exist/l2-vlan-does-not-exist-ss3.png', caption: 'Create Missing VLAN: Add VLAN to database.' },
                { src: 'L2DataLinkLayer/l2-vlan-does-not-exist/l2-vlan-does-not-exist-ss4.png', caption: 'Verify Assignment: Confirm ports properly assigned.' }
            ]
        },
        'l2-trunk-misconfig': {
            title: 'L2 - Trunk Port Misconfiguration',
            icon: 'fa-truck',
            definition: 'Trunk ports not properly configured to carry multiple VLANs between switches, causing VLAN isolation and communication failures across switch boundaries.',
            causes: [
                'Trunk port not configured',
                'Port configured as access instead of trunk',
                'VLAN not allowed on trunk',
                'Trunk encapsulation issues',
                'Encapsulation mismatch (ISL vs. 802.1Q)',
                'Allowed VLAN list misconfigured',
                'Native VLAN mismatch between switches'
            ],
            steps: [
                'Identify Inter-Switch Links: Find connections between switches',
                'Check Current Port Mode: Verify if port is access or trunk',
                'Configure Trunk Mode: Set ports to trunk operation',
                'Set encapsulation type',
                'Configure Allowed VLANs: Specify which VLANs can cross trunk',
                'Configure Native VLAN: Configure untagged VLAN for trunk',
                'Verify Trunk Status: Confirm trunk is operational'
            ],
            verification: [
                'Trunk Status: Verify interface is in trunking mode',
                'Encapsulation: Confirm matching encapsulation on both sides',
                'Allowed VLANs: Check which VLANs can pass through trunk',
                '"show interfaces trunk" shows active trunk',
                'Multiple VLANs traverse the trunk link',
                'Native VLAN matches on both switches',
                'Allowed VLAN list includes required VLANs',
                'Devices in same VLAN across switches can ping'
            ],
            commands: [
                '// Terminal Commands - Diagnosis',
                'Switch> show interfaces trunk',
                'Switch> show interfaces gigabitEthernet 0/1 switchport',
                'Switch> show vlan brief',
                'Switch> show spanning-tree',
                '// Terminal Commands - Solution',
                'Switch> enable',
                'Switch# configure terminal',
                'Switch(config)# interface gigabitEthernet 0/1',
                'Switch(config-if)# switchport mode trunk',
                'Switch(config-if)# switchport trunk allowed vlan 1,10,20',
                'Switch(config-if)# switchport trunk native vlan 1',
                'Switch(config-if)# exit'
            ],
            simulation: 'Create a network with two switches connected by a link that should be a trunk. Configure VLANs on both switches and observe that inter-VLAN traffic fails until the trunk is properly configured.',
            simulation_pkt: 'L2DataLinkLayer/l2-trunk-port-misconfiguration/l2-trunk-port-misconfiguration.pkt',
            screenshots: [
                { src: 'L2DataLinkLayer/l2-trunk-port-misconfiguration/l2-trunk-port-misconfiguration-ss1.png', caption: 'Trunk ports not properly configured to carry multiple VLANs between switches, causing VLAN isolation and communication failures across switch boundaries.' },
                { src: 'L2DataLinkLayer/l2-trunk-port-misconfiguration/l2-trunk-port-misconfiguration-ss2.png', caption: 'Trunk ports not properly configured to carry multiple VLANs between switches, causing VLAN isolation and communication failures across switch boundaries.' },
                { src: 'L2DataLinkLayer/l2-trunk-port-misconfiguration/l2-trunk-port-misconfiguration-ss3.png', caption: 'Trunk ports not properly configured to carry multiple VLANs between switches, causing VLAN isolation and communication failures across switch boundaries.' },
                { src: 'L2DataLinkLayer/l2-trunk-port-misconfiguration/l2-trunk-port-misconfiguration-ss4.png', caption: 'Trunk ports not properly configured to carry multiple VLANs between switches, causing VLAN isolation and communication failures across switch boundaries.' },
                { src: 'L2DataLinkLayer/l2-trunk-port-misconfiguration/l2-trunk-port-misconfiguration-ss5.png', caption: 'Trunk ports not properly configured to carry multiple VLANs between switches, causing VLAN isolation and communication failures across switch boundaries.' },
                { src: 'L2DataLinkLayer/l2-trunk-port-misconfiguration/l2-trunk-port-misconfiguration-ss6.png', caption: 'Trunk ports not properly configured to carry multiple VLANs between switches, causing VLAN isolation and communication failures across switch boundaries.' }
            ]
        },
        'l2-port-security': {
            title: 'L2 - Port Security Blocking Port',
            icon: 'fa-user-lock',
            definition: 'Port security feature has detected violation and shut down the interface, preventing any traffic flow. Port shows error-disabled state due to security policy enforcement.',
            causes: [
                'MAC address violation detected',
                'MAC address limit exceeded on port',
                'MAC address aging causing re-learning',
                'Unauthorized device connected',
                'Sticky MAC addresses conflict',
                'Security violation action triggered',
                'Incorrect port security configuration'
            ],
            steps: [
                'Check Port Status: Identify error-disabled ports',
                'Review Security Configuration: Check port security settings',
                'Clear Security Violations: Reset violation counters',
                'Adjust Security Policy: Modify MAC address limits',
                'Re-enable Port: Bring interface back online'
            ],
            verification: [
                'Interface status shows "up/up"',
                'Port security shows secure addresses learned',
                'No violation counters incrementing',
                'Normal traffic flow restored',
                'Security policy appropriate for requirements'
            ],
            commands: [
                '// Terminal Commands - Diagnosis',
                'Switch1> show port-security',
                'Switch1> show port-security interface fastethernet 0/1',
                '// Terminal Commands - Solution',
                'Switch1> enable',
                'Switch1# configure terminal',
                'Switch1(config)# interface fastEthernet 0/1',
                'Switch1(config-if)# shutdown',
                'Switch1(config-if)# no shutdown',
                'Switch1(config-if)# exit',
                'Switch1# clear port-security sticky'
            ],
            simulation: 'Configure port security on a switch port in Packet Tracer with a maximum of one MAC address. Connect a device, then connect a second device to trigger a violation. Observe the port entering err-disabled state.',
            simulation_pkt: 'L2DataLinkLayer/l2-port-security-blocking-port/l2-port-security-blocking-port.pkt',
            screenshots: [
                { src: 'L2DataLinkLayer/l2-port-security-blocking-port/l2-port-security-blocking-port-ss1.png', caption: 'Port security feature has detected violation and shut down the interface, preventing any traffic flow. Port shows error-disabled state due to security policy enforcement.' },
                { src: 'L2DataLinkLayer/l2-port-security-blocking-port/l2-port-security-blocking-port-ss2.png', caption: 'Port security feature has detected violation and shut down the interface, preventing any traffic flow. Port shows error-disabled state due to security policy enforcement.' },
                { src: 'L2DataLinkLayer/l2-port-security-blocking-port/l2-port-security-blocking-port-ss3.png', caption: 'Port security feature has detected violation and shut down the interface, preventing any traffic flow. Port shows error-disabled state due to security policy enforcement.' },
                { src: 'L2DataLinkLayer/l2-port-security-blocking-port/l2-port-security-blocking-port-ss4.png', caption: 'Port security feature has detected violation and shut down the interface, preventing any traffic flow. Port shows error-disabled state due to security policy enforcement.' },
                { src: 'L2DataLinkLayer/l2-port-security-blocking-port/l2-port-security-blocking-port-ss5.png', caption: 'Port security feature has detected violation and shut down the interface, preventing any traffic flow. Port shows error-disabled state due to security policy enforcement.' },
                { src: 'L2DataLinkLayer/l2-port-security-blocking-port/l2-port-security-blocking-port-ss6.png', caption: 'Port security feature has detected violation and shut down the interface, preventing any traffic flow. Port shows error-disabled state due to security policy enforcement.' },
                { src: 'L2DataLinkLayer/l2-port-security-blocking-port/l2-port-security-blocking-port-ss7.png', caption: 'Port security feature has detected violation and shut down the interface, preventing any traffic flow. Port shows error-disabled state due to security policy enforcement.' },
                { src: 'L2DataLinkLayer/l2-port-security-blocking-port/l2-port-security-blocking-port-ss8.png', caption: 'Port security feature has detected violation and shut down the interface, preventing any traffic flow. Port shows error-disabled state due to security policy enforcement.' },
                { src: 'L2DataLinkLayer/l2-port-security-blocking-port/l2-port-security-blocking-port-ss9.png', caption: 'Port security feature has detected violation and shut down the interface, preventing any traffic flow. Port shows error-disabled state due to security policy enforcement.' },
                { src: 'L2DataLinkLayer/l2-port-security-blocking-port/l2-port-security-blocking-port-ss10.png', caption: 'Port security feature has detected violation and shut down the interface, preventing any traffic flow. Port shows error-disabled state due to security policy enforcement.' }
            ]
        },
        'l2-duplex-speed-mismatch': {
            title: 'L2 - Duplex or Speed Mismatch',
            icon: 'fa-tachometer-alt',
            definition: 'Network interfaces configured with different duplex modes or speeds causing performance issues, collisions, and intermittent connectivity problems.',
            causes: [
                'One side auto-negotiation, other side manual configuration',
                'Speed mismatch between connected devices',
                'Full-duplex vs half-duplex mismatch',
                'Auto-negotiation failure'
            ],
            steps: [
                'Check Interface Settings: Review speed and duplex configuration',
                'Identify Mismatches: Compare settings on both sides',
                'Standardize Configuration: Set matching speed/duplex',
                'Enable Auto-negotiation: Allow automatic configuration',
                'Verify Operation: Confirm error-free operation'
            ],
            verification: [
                'Both interfaces show matching speed/duplex',
                'No collision or error counters incrementing',
                'Full bandwidth utilization available',
                'Stable link status',
                'Good network performance'
            ],
            commands: [
                '// Diagnose Interface Settings',
                'Switch1> enable',
                'Switch1# configure terminal',
                'Switch1# show interfaces gig 0/1',
                'Switch1# show interfaces gig 0/1 status',
                'Router1> enable',
                'Router1# configure terminal',
                'Router1# show interfaces gig 0/0/0',
                'Router1# show interfaces gig 0/0/0 status',
                '// Fix with Auto-negotiation (Recommended)',
                'Switch1> enable',
                'Switch1# configure terminal',
                'Switch1(config)# interface gig 0/1',
                'Switch1(config-if)# speed auto',
                'Switch1(config-if)# duplex auto',
                'Switch1(config-if)# exit',
                'Router1> enable',
                'Router1# configure terminal',
                'Router1(config)# interface gig 0/0/0',
                'Router1(config-if)# speed auto',
                'Router1(config-if)# duplex auto',
                'Router1(config-if)# exit',
                '// Alternative - Manual Matching',
                'Switch1> enable',
                'Switch1# configure terminal',
                'Switch1(config)# interface gig 0/1',
                'Switch1(config-if)# speed 100',
                'Switch1(config-if)# duplex full',
                'Switch1(config-if)# exit',
                'Router1> enable',
                'Router1# configure terminal',
                'Router1(config)# interface gig 0/0/0',
                'Router1(config-if)# speed 100',
                'Router1(config-if)# duplex full',
                'Router1(config-if)# exit'        
            ],
            simulation: 'Connect two devices in Packet Tracer with mismatched duplex settings (one full, one half). Transfer data between them and observe the errors and poor performance. Then correct the settings and test again.',
            simulation_pkt: 'L2DataLinkLayer/l2-duplex-or-speed-mismatch/l2-duplex-or-speed-mismatch.pkt',
            screenshots: [
                { src: 'L2DataLinkLayer/l2-duplex-or-speed-mismatch/l2-duplex-or-speed-mismatch-ss1.png', caption: 'Network interfaces configured with different duplex modes or speeds causing performance issues, collisions, and intermittent connectivity problems.' },
                { src: 'L2DataLinkLayer/l2-duplex-or-speed-mismatch/l2-duplex-or-speed-mismatch-ss2.png', caption: 'Check Interface Settings: Review speed and duplex configuration.' },
                { src: 'L2DataLinkLayer/l2-duplex-or-speed-mismatch/l2-duplex-or-speed-mismatch-ss3.png', caption: 'Check Interface Settings: Review speed and duplex configuration.' },
                { src: 'L2DataLinkLayer/l2-duplex-or-speed-mismatch/l2-duplex-or-speed-mismatch-ss4.png', caption: 'Auto Configuration.' },
                { src: 'L2DataLinkLayer/l2-duplex-or-speed-mismatch/l2-duplex-or-speed-mismatch-ss5.png', caption: 'Auto Configuration.' },
                { src: 'L2DataLinkLayer/l2-duplex-or-speed-mismatch/l2-duplex-or-speed-mismatch-ss6.png', caption: 'Manual Configuration.' },
                { src: 'L2DataLinkLayer/l2-duplex-or-speed-mismatch/l2-duplex-or-speed-mismatch-ss7.png', caption: 'Manual Configuration.' },
                { src: 'L2DataLinkLayer/l2-duplex-or-speed-mismatch/l2-duplex-or-speed-mismatch-ss8.png', caption: 'Verify Operation: Confirm error-free operation.' },
            ]
        },
        'l2-stp-block': {
            title: 'L2 - Spanning Tree Protocol (STP) Blocking Port',
            icon: 'fa-ban',
            definition: 'STP has placed a port in blocking state to prevent loops, but this blocks legitimate traffic flow. Port appears up but cannot forward data traffic.',
            causes: [
                'Redundant paths causing loop prevention',
                'Sub-optimal STP root bridge selection',
                'Port priority configuration issues',
                'STP convergence still in progress'
            ],
            steps: [
                'Check confiurations: Review STP settings on switches',
                'Check STP Status: Review spanning tree port states',
                'Identify Blocked Ports: Find ports in blocking state',
                'Analyze Topology: Understand why port is blocked',
                'Adjust Root Bridge: Influence STP root selection',
                'Modify Port Priority: Change port costs if needed',
                'Verify Convergence: Ensure STP has converged properly'
            ],
            verification: [
                'Root bridge is optimal switch',
                'All necessary ports in forwarding state',
                'No loops in network topology',
                'End-device ports use PortFast',
                'STP convergence completed successfully'
            ],
            commands: [
                '// Terminal Commands - Diagnosis',
                'Switch> show spanning-tree',
                'Switch> show spanning-tree brief',
                'Switch> show spanning-tree root',
                'Switch> show spanning-tree interface fastEthernet 0/1',
                'Switch> show spanning-tree summary',
                '// Terminal Commands - Solution',
                'Switch> enable',
                'Switch# configure terminal',
                'Switch(config)# spanning-tree vlan 1 priority 4096',
                'Switch(config)# interface fastEthernet 0/3',
                'Switch(config-if)# spanning-tree portfast',
                'Switch(config-if)# exit'
            ],
            simulation: 'Create a network with redundant links between switches in Packet Tracer. Observe which ports are blocked by STP. Modify the root bridge priority and observe the changes in the STP topology.',
            simulation_pkt: 'L2DataLinkLayer/l2-stp-blocking-port/l2-stp-blocking-port.pkt',
            screenshots: [
                { src: 'L2DataLinkLayer/l2-stp-blocking-port/l2-stp-blocking-port-ss1.png', caption: 'STP has placed a port in blocking state to prevent loops, but this blocks legitimate traffic flow. Port appears up but cannot forward data traffic.' },
                { src: 'L2DataLinkLayer/l2-stp-blocking-port/l2-stp-blocking-port-ss2.png', caption: 'STP has placed a port in blocking state to prevent loops, but this blocks legitimate traffic flow. Port appears up but cannot forward data traffic.' },
                { src: 'L2DataLinkLayer/l2-stp-blocking-port/l2-stp-blocking-port-ss3.png', caption: 'STP has placed a port in blocking state to prevent loops, but this blocks legitimate traffic flow. Port appears up but cannot forward data traffic.' },
                { src: 'L2DataLinkLayer/l2-stp-blocking-port/l2-stp-blocking-port-ss4.png', caption: 'STP has placed a port in blocking state to prevent loops, but this blocks legitimate traffic flow. Port appears up but cannot forward data traffic.' },
            ]
        },
        'l2-arp-issues': {
            title: 'L2 - ARP Issues (Incorrect or Incomplete ARP Table)',
            icon: 'fa-address-card',
            definition: 'ARP (Address Resolution Protocol) table contains incorrect, incomplete, or stale entries preventing proper Layer 2 to Layer 3 address resolution and communication.',
            causes: [
                'ARP table not populated',
                'Incorrect ARP entries',
                'ARP aging timeout',
                'Proxy ARP issues',
                'Static ARP entries conflicting with dynamic',
                'ARP cache timeout too short or too long',
                'ARP poisoning or spoofing attacks',
                'Network topology changes not reflected in ARP'
            ],
            steps: [
                'Check ARP Table: Review current ARP entries',
                'Identify Incorrect Entries: Find wrong or missing mappings',
                'Clear Problematic Entries: Remove incorrect static entries',
                'Force ARP Learning: Generate traffic to rebuild table',
                'Verify Resolution: Confirm correct IP-to-MAC mappings',
                'Check ARP Behavior: Check for ongoing issues',
                'Verify ARP table population after traffic generation.'
            ],
            verification: [
                'ARP table shows correct IP-to-MAC mappings',
                'Dynamic entries learned automatically',
                'No conflicting static entries',
                'Successful ping between all devices',
                'Normal Layer 2 to Layer 3 resolution'
            ],
            commands: [
                'PC1> arp -d',
                'PC1> arp -a',
                'PC1> ping 192.168.1.1 // Router IP',
                'PC1> ping 192.168.1.20 // PC2 IP',
                'Router1> show arp',
                'Router1> show ip arp',
                'Router1# clear arp',
                'Router1# clear arp-cache',
                'Switch1> show mac address-table',
            ],
            simulation: 'In Packet Tracer, check the ARP table on a router before and after communication with other devices. Clear the ARP table and observe how it gets repopulated when traffic is generated.',
            simulation_pkt: 'L2DataLinkLayer/l2-arp-table-not-populated/l2-arp-table-not-populated.pkt',
            screenshots: [
                { src: 'L2DataLinkLayer/l2-arp-table-not-populated/l2-arp-table-not-populated-ss1.png', caption: 'ARP (Address Resolution Protocol) table contains incorrect, incomplete, or stale entries preventing proper Layer 2 to Layer 3 address resolution and communication.' },
                { src: 'L2DataLinkLayer/l2-arp-table-not-populated/l2-arp-table-not-populated-ss2.png', caption: 'Force ARP Learning: Generate traffic to rebuild table.' },
                { src: 'L2DataLinkLayer/l2-arp-table-not-populated/l2-arp-table-not-populated-ss3.png', caption: 'Check ARP Table: Review current ARP entries.' },
                { src: 'L2DataLinkLayer/l2-arp-table-not-populated/l2-arp-table-not-populated-ss4.png', caption: 'Check ARP Table: Review current ARP entries.' },
                { src: 'L2DataLinkLayer/l2-arp-table-not-populated/l2-arp-table-not-populated-ss5.png', caption: 'Check ARP Table: Review current ARP entries.' },
                { src: 'L2DataLinkLayer/l2-arp-table-not-populated/l2-arp-table-not-populated-ss6.png', caption: 'Check ARP Table: Review current ARP entries.' },
            ]
        }
    },
    // --- L3 Content --- 
    ...{
        'l3-ip-config': {
            title: 'L3 - Incorrect or Missing IP Address Configuration',
            icon: 'fa-map-marker-alt',
            definition: 'Devices cannot communicate due to incorrect IP addresses, missing IP configuration, or IP addresses in wrong subnets. Interfaces may show as up/up but connectivity fails.',
            causes: [
                'No IP address assigned to interface',
                'Incorrect IP address configuration',
                'Subnet mask mismatch',
                'IP address conflicts within the same network',
                'Interface not activated (no ip)'
            ],
            steps: [
                'Identify the Problem: <br> Router2> enable <br> Router2# show ip interface brief <br> Router2# show running-config',
                'Configure Missing IP Address: <br> Router2> enable <br> Router2# configure terminal <br> Router2(config)# interface gigabitethernet 0/0/0 <br> Router2(config-if)# ip address 192.168.2.1 255.255.255.0 <br> Router2(config-if)# no shutdown <br> Router2(config-if)# exit <br> Router2(config)# exit',
                'Configure PC IP Address: <br> PC2 IP: 192.168.2.10 <br> Subnet Mask: 255.255.255.0 <br> Default Gateway: 192.168.2.1'
            ],
            verification: [
                'Router2# show ip interface brief',
                'Router2# ping 192.168.1.10',
                'Router2# ping 192.168.2.10',
                'PC1> ping 192.168.2.10',
                'PC1> ping 192.168.2.1',      
                'PC2> ping 192.168.1.10',
                'PC2> ping 192.168.2.1',           
            ],
            commands: [
                '// Identify the Problem:',
                'Router2> enable',
                'Router2# show ip interface brief',
                'Router2# show running-config',

                '// Configure Missing IP Address:',
                'Router2> enable',
                'Router2# configure terminal',
                'Router2(config)# interface gigabitethernet 0/0/0',
                'Router2(config-if)# ip address 192.168.2.1 255.255.255.0',
                'Router2(config-if)# no shutdown',
                'Router2(config-if)# exit',
                'Router2(config)# exit',

                '// Configure PC IP Address:',
                'PC2 IP: 192.168.2.10',
                'Subnet Mask: 255.255.255.0',
                'Default Gateway: 192.168.2.1'
            ],
            simulation: 'Configure incorrect IP addresses on devices in the same subnet in Packet Tracer. Observe the communication failure, then correct the IP configurations and test connectivity.',
            simulation_pkt: 'L3NetworkLayer/l3-incorrect-or-missing-ip-address-configuration/l3-incorrect-or-missing-ip-address-configuration.pkt',
            screenshots: [
                { src: 'L3NetworkLayer/l3-incorrect-or-missing-ip-address-configuration/l3-incorrect-or-missing-ip-address-configuration-ss1.png', caption: 'Devices cannot communicate due to incorrect IP addresses, missing IP configuration, or IP addresses in wrong subnets. Interfaces may show as up/up but connectivity fails.' },
                { src: 'L3NetworkLayer/l3-incorrect-or-missing-ip-address-configuration/l3-incorrect-or-missing-ip-address-configuration-ss2.png', caption: 'Devices cannot communicate due to incorrect IP addresses, missing IP configuration, or IP addresses in wrong subnets. Interfaces may show as up/up but connectivity fails.' },
                { src: 'L3NetworkLayer/l3-incorrect-or-missing-ip-address-configuration/l3-incorrect-or-missing-ip-address-configuration-ss3.png', caption: 'Devices cannot communicate due to incorrect IP addresses, missing IP configuration, or IP addresses in wrong subnets. Interfaces may show as up/up but connectivity fails.' },
                { src: 'L3NetworkLayer/l3-incorrect-or-missing-ip-address-configuration/l3-incorrect-or-missing-ip-address-configuration-ss4.png', caption: 'Devices cannot communicate due to incorrect IP addresses, missing IP configuration, or IP addresses in wrong subnets. Interfaces may show as up/up but connectivity fails.' },
                { src: 'L3NetworkLayer/l3-incorrect-or-missing-ip-address-configuration/l3-incorrect-or-missing-ip-address-configuration-ss5.png', caption: 'Devices cannot communicate due to incorrect IP addresses, missing IP configuration, or IP addresses in wrong subnets. Interfaces may show as up/up but connectivity fails.' },
                { src: 'L3NetworkLayer/l3-incorrect-or-missing-ip-address-configuration/l3-incorrect-or-missing-ip-address-configuration-ss6.png', caption: 'Devices cannot communicate due to incorrect IP addresses, missing IP configuration, or IP addresses in wrong subnets. Interfaces may show as up/up but connectivity fails.' },
                { src: 'L3NetworkLayer/l3-incorrect-or-missing-ip-address-configuration/l3-incorrect-or-missing-ip-address-configuration-ss7.png', caption: 'Devices cannot communicate due to incorrect IP addresses, missing IP configuration, or IP addresses in wrong subnets. Interfaces may show as up/up but connectivity fails.' },
                { src: 'L3NetworkLayer/l3-incorrect-or-missing-ip-address-configuration/l3-incorrect-or-missing-ip-address-configuration-ss8.png', caption: 'Devices cannot communicate due to incorrect IP addresses, missing IP configuration, or IP addresses in wrong subnets. Interfaces may show as up/up but connectivity fails.' },
                { src: 'L3NetworkLayer/l3-incorrect-or-missing-ip-address-configuration/l3-incorrect-or-missing-ip-address-configuration-ss9.png', caption: 'Devices cannot communicate due to incorrect IP addresses, missing IP configuration, or IP addresses in wrong subnets. Interfaces may show as up/up but connectivity fails.' }
            ]
        },
        'l3-gateway-config': {
            title: 'L3 - Default Gateway Missing or Wrong',
            icon: 'fa-door-open',
            definition: 'Devices can communicate within their local network but cannot reach other networks due to missing or incorrect default gateway configuration.',
            causes: [
                'No default gateway configured on end devices',
                'Incorrect gateway IP address',
                'Gateway router interface is down',
                'Gateway not in same subnet',
                'Default gateway pointing to non-existent router'
            ],
            steps: [
                'Test Connectivity: <br> PC1> ping 192.168.1.20 <br> PC1> ping 192.168.2.20 <br> PC2> ping 192.168.1.20 <br> PC2> ping 192.168.2.20',
                'Check Current Gateway Configuration: <br> PC3> ipconfig /all <br> PC4> ipconfig /all',
                'Configure Correct Default Gateway: <br> PC3: Set Gateway to 192.168.1.1 <br> PC4: Set Gateway to 192.168.2.1',
                'Test Connectivity again: <br> PC1> ping 192.168.1.20 <br> PC1> ping 192.168.2.20 <br> PC2> ping 192.168.1.20 <br> PC2> ping 192.168.2.20'
            ],
            verification: [
                'PC1> ping 192.168.2.20',
                'PC2> ping 192.168.1.20',
                'PC1> tracert 192.168.2.20',
                'PC2> tracert 192.168.1.20',
                'Router1# show ip route',
                'Router2# show ip route'
            ],
            commands: [
                '// Test Connectivity:',
                'PC1> ping 192.168.1.20',
                'PC1> ping 192.168.2.20',
                'PC2> ping 192.168.1.20',
                'PC2> ping 192.168.2.20',

                '// Check Current Gateway Configuration:',
                'PC3> ipconfig /all',
                'PC4> ipconfig /all',

                '// Configure Correct Default Gateway:',
                'PC3: Set Gateway to 192.168.1.1',
                'PC4: Set Gateway to 192.168.2.1',

                '// Test Connectivity again:',
                'PC1> ping 192.168.1.20',
                'PC1> ping 192.168.2.20',
                'PC2> ping 192.168.1.20',
                'PC2> ping 192.168.2.20'
            ],
            simulation: 'Configure a PC with incorrect or missing default gateway in Packet Tracer. Verify it can communicate with devices in the same subnet but not with other networks. Correct the gateway configuration and test again.',
            simulation_pkt: 'L3NetworkLayer/l3-default-gateway-missing-or-wrong/l3-default-gateway-missing-or-wrong.pkt',
            screenshots: [
                { src: 'L3NetworkLayer/l3-default-gateway-missing-or-wrong/l3-default-gateway-missing-or-wrong-ss1.png', caption: 'Devices can communicate within their local network but cannot reach other networks due to missing or incorrect default gateway configuration.' },
                { src: 'L3NetworkLayer/l3-default-gateway-missing-or-wrong/l3-default-gateway-missing-or-wrong-ss2.png', caption: 'Devices can communicate within their local network but cannot reach other networks due to missing or incorrect default gateway configuration.' },
                { src: 'L3NetworkLayer/l3-default-gateway-missing-or-wrong/l3-default-gateway-missing-or-wrong-ss3.png', caption: 'Devices can communicate within their local network but cannot reach other networks due to missing or incorrect default gateway configuration.' },
                { src: 'L3NetworkLayer/l3-default-gateway-missing-or-wrong/l3-default-gateway-missing-or-wrong-ss4.png', caption: 'Devices can communicate within their local network but cannot reach other networks due to missing or incorrect default gateway configuration.' },
                { src: 'L3NetworkLayer/l3-default-gateway-missing-or-wrong/l3-default-gateway-missing-or-wrong-ss5.png', caption: 'Devices can communicate within their local network but cannot reach other networks due to missing or incorrect default gateway configuration.' },
                { src: 'L3NetworkLayer/l3-default-gateway-missing-or-wrong/l3-default-gateway-missing-or-wrong-ss6.png', caption: 'Devices can communicate within their local network but cannot reach other networks due to missing or incorrect default gateway configuration.' },
                { src: 'L3NetworkLayer/l3-default-gateway-missing-or-wrong/l3-default-gateway-missing-or-wrong-ss7.png', caption: 'Devices can communicate within their local network but cannot reach other networks due to missing or incorrect default gateway configuration.' },
                { src: 'L3NetworkLayer/l3-default-gateway-missing-or-wrong/l3-default-gateway-missing-or-wrong-ss8.png', caption: 'Devices can communicate within their local network but cannot reach other networks due to missing or incorrect default gateway configuration.' },
                { src: 'L3NetworkLayer/l3-default-gateway-missing-or-wrong/l3-default-gateway-missing-or-wrong-ss9.png', caption: 'Devices can communicate within their local network but cannot reach other networks due to missing or incorrect default gateway configuration.' },
                { src: 'L3NetworkLayer/l3-default-gateway-missing-or-wrong/l3-default-gateway-missing-or-wrong-ss10.png', caption: 'Devices can communicate within their local network but cannot reach other networks due to missing or incorrect default gateway configuration.' },
                { src: 'L3NetworkLayer/l3-default-gateway-missing-or-wrong/l3-default-gateway-missing-or-wrong-ss11.png', caption: 'Devices can communicate within their local network but cannot reach other networks due to missing or incorrect default gateway configuration.' },
            ]
        },
        'l3-no-routing': {
            title: 'L3 - No Routing Between Networks',
            icon: 'fa-route',
            definition: 'Devices can reach their default gateway but cannot communicate with remote networks due to missing routes in routing table.',
            causes: [
                'No static routes configured',
                'Missing routing protocol configuration',
                'Incorrect route entries',
                'Routing protocol not enabled on interfaces'
            ],
            steps: [
                'Diagnose Routing Issue: <br> Router1> enable <br> Router1# show ip route <br> Router1# ping 10.0.0.2 (Router2\'s interface) <br> Router2# show ip route <br> Router2# ping 10.0.0.1 (Router1\'s interface) <br> PC1> ping 192.168.2.10 <br> PC2> ping 192.168.1.10',
                'Configure Routes: <br> Router1> enable <br> Router1# configure terminal <br> Router1(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.2 <br> Router2> enable <br> Router2# configure terminal <br> Router2(config)# ip route 192.168.1.0 255.255.255.0 10.0.0.1',
                'Test Connectivity: <br> Router1> enable <br> Router1# show ip route <br> Router1# ping 10.0.0.2 (Router2\'s interface) <br> Router2# show ip route <br> Router2# ping 10.0.0.1 (Router1\'s interface) <br> PC1> ping 192.168.2.10 <br> PC2> ping 192.168.1.10'
            ],
            verification: [
                'Router1# show ip route',
                'Router2# show ip route',
                'PC1> ping 192.168.2.1',
                'PC1> ping 192.168.2.10',
                'PC1> tracert 192.168.2.10'
            ],
            commands: [
                '// Diagnose Routing Issue:',
                'Router1> enable',
                'Router1# show ip route',
                'Router1# ping 10.0.0.2 (Router2\'s interface)',
                'Router2# show ip route',
                'Router2# ping 10.0.0.1 (Router1\'s interface)',
                'PC1> ping 192.168.2.10',
                'PC2> ping 192.168.1.10',

                '// Configure Routes:',
                'Router1> enable',
                'Router1# configure terminal',
                'Router1(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.2',
                'Router2> enable',
                'Router2# configure terminal',
                'Router2(config)# ip route 192.168.1.0 255.255.255.0 10.0.0.1',

                '// Test Connectivity:',
                'Router1> enable',
                'Router1# show ip route',
                'Router1# ping 10.0.0.2 (Router2\'s interface)',
                'Router2# show ip route',
                'Router2# ping 10.0.0.1 (Router1\'s interface)',
                'PC1> ping 192.168.2.10',
                'PC2> ping 192.168.1.10'
            ],
            simulation: 'Create a network with multiple subnets connected by routers in Packet Tracer. Observe that traffic cannot pass between subnets without proper routing configuration. Configure static or dynamic routing and test connectivity.',
            simulation_pkt: 'L3NetworkLayer/l3-no-routing-between-networks/l3-no-routing-between-networks.pkt',
            screenshots: [
                { src: 'L3NetworkLayer/l3-no-routing-between-networks/l3-no-routing-between-networks-ss1.png', caption: 'Devices can reach their default gateway but cannot communicate with remote networks due to missing routes in routing table.' },
                { src: 'L3NetworkLayer/l3-no-routing-between-networks/l3-no-routing-between-networks-ss2.png', caption: 'Devices can reach their default gateway but cannot communicate with remote networks due to missing routes in routing table.' },
                { src: 'L3NetworkLayer/l3-no-routing-between-networks/l3-no-routing-between-networks-ss3.png', caption: 'Devices can reach their default gateway but cannot communicate with remote networks due to missing routes in routing table.' },
                { src: 'L3NetworkLayer/l3-no-routing-between-networks/l3-no-routing-between-networks-ss4.png', caption: 'Devices can reach their default gateway but cannot communicate with remote networks due to missing routes in routing table.' },
                { src: 'L3NetworkLayer/l3-no-routing-between-networks/l3-no-routing-between-networks-ss5.png', caption: 'Devices can reach their default gateway but cannot communicate with remote networks due to missing routes in routing table.' },
                { src: 'L3NetworkLayer/l3-no-routing-between-networks/l3-no-routing-between-networks-ss6.png', caption: 'Devices can reach their default gateway but cannot communicate with remote networks due to missing routes in routing table.' },
                { src: 'L3NetworkLayer/l3-no-routing-between-networks/l3-no-routing-between-networks-ss7.png', caption: 'Devices can reach their default gateway but cannot communicate with remote networks due to missing routes in routing table.' },
                { src: 'L3NetworkLayer/l3-no-routing-between-networks/l3-no-routing-between-networks-ss8.png', caption: 'Devices can reach their default gateway but cannot communicate with remote networks due to missing routes in routing table.' },
                { src: 'L3NetworkLayer/l3-no-routing-between-networks/l3-no-routing-between-networks-ss9.png', caption: 'Devices can reach their default gateway but cannot communicate with remote networks due to missing routes in routing table.' },
            ]
        },
        'l3-subnet-misconfig': {
            title: 'L3 - Subnetting Misconfiguration',
            icon: 'fa-divide',
            definition: 'Devices cannot communicate due to incorrect subnet calculations, wrong subnet masks, or devices placed in wrong subnets.',
            causes: [
                'Incorrect subnet mask',
                'Wrong CIDR calculation',
                'Devices configured in overlapping subnets',
                'Incorrect VLSM implementation',
                'Broadcast domain misconfiguration'
            ],
            steps: [
                'Calculate network address using IP and subnet mask',
                'Verify subnet boundaries',
                'Check interface IP configuration',
                'Configure correct subnet mask on interfaces',
                'Implement proper VLSM if needed',
                'Verify all devices in same subnet can communicate',
                'Check subnet calculations with network tools'
            ],
            verification: [
                'PC1> ipconfig /all',
                'PC1> ping 192.168.1.125',
                'PC2> ipconfig /all',
                'PC2> ping 192.168.1.10'
            ],
            commands: [
                'PC1> ipconfig /all',
                'PC1> ping 192.168.1.125',
                'PC2> ipconfig /all',
                'PC2> ping 192.168.1.10'
            ],
            simulation: 'Configure devices with different subnet masks in what should be the same subnet in Packet Tracer. Observe the communication issues, then correct the subnet masks to ensure all devices are in the same subnet.',
            simulation_pkt: 'L3NetworkLayer/l3-subnetting-misconfiguration/l3-subnetting-misconfiguration.pkt',
            screenshots: [
                { src: 'L3NetworkLayer/l3-subnetting-misconfiguration/l3-subnetting-misconfiguration-ss1.png', caption: 'Devices cannot communicate due to incorrect subnet calculations, wrong subnet masks, or devices placed in wrong subnets.' },
                { src: 'L3NetworkLayer/l3-subnetting-misconfiguration/l3-subnetting-misconfiguration-ss2.png', caption: 'Devices cannot communicate due to incorrect subnet calculations, wrong subnet masks, or devices placed in wrong subnets.' },
                { src: 'L3NetworkLayer/l3-subnetting-misconfiguration/l3-subnetting-misconfiguration-ss3.png', caption: 'Devices cannot communicate due to incorrect subnet calculations, wrong subnet masks, or devices placed in wrong subnets.' },
                { src: 'L3NetworkLayer/l3-subnetting-misconfiguration/l3-subnetting-misconfiguration-ss4.png', caption: 'Devices cannot communicate due to incorrect subnet calculations, wrong subnet masks, or devices placed in wrong subnets.' },
                { src: 'L3NetworkLayer/l3-subnetting-misconfiguration/l3-subnetting-misconfiguration-ss5.png', caption: 'Devices cannot communicate due to incorrect subnet calculations, wrong subnet masks, or devices placed in wrong subnets.' },
                { src: 'L3NetworkLayer/l3-subnetting-misconfiguration/l3-subnetting-misconfiguration-ss6.png', caption: 'Devices cannot communicate due to incorrect subnet calculations, wrong subnet masks, or devices placed in wrong subnets.' },
                { src: 'L3NetworkLayer/l3-subnetting-misconfiguration/l3-subnetting-misconfiguration-ss7.png', caption: 'Devices cannot communicate due to incorrect subnet calculations, wrong subnet masks, or devices placed in wrong subnets.' },
                { src: 'L3NetworkLayer/l3-subnetting-misconfiguration/l3-subnetting-misconfiguration-ss8.png', caption: 'Devices cannot communicate due to incorrect subnet calculations, wrong subnet masks, or devices placed in wrong subnets.' },
                { src: 'L3NetworkLayer/l3-subnetting-misconfiguration/l3-subnetting-misconfiguration-ss9.png', caption: 'Devices cannot communicate due to incorrect subnet calculations, wrong subnet masks, or devices placed in wrong subnets.' },
            ]
        },
        'l3-routing-protocol-misconfig': {
            title: 'L3 - Routing Protocol Misconfiguration (RIP, OSPF)',
            icon: 'fa-cogs',
            definition: 'Dynamic routing protocols are configured but not working properly due to configuration errors, version mismatches, or network statement issues.',
            causes: [
                'Incorrect network statements in routing protocol',
                'Version mismatch (RIPv1 vs RIPv2)',
                'Authentication mismatch in OSPF',
                'Different OSPF areas not properly connected',
                'Timer mismatches'
            ],
            steps: [
                'Diagnose Routing Issue: <br> Router1> enable <br> Router1# show ip route <br> Router1# ping 10.0.0.2 (Router2\'s interface) <br> Router2# show ip route <br> Router2# ping 10.0.0.1 (Router1\'s interface) <br> PC1> ping 192.168.2.10 <br> PC2> ping 192.168.1.10',
                'Configure Routes: <br> Router1> enable <br> Router1# configure terminal <br> Router1(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.2 <br> Router2> enable <br> Router2# configure terminal <br> Router2(config)# ip route 192.168.1.0 255.255.255.0 10.0.0.1',
                'Test Connectivity: <br> Router1> enable <br> Router1# show ip route <br> Router1# ping 10.0.0.2 (Router2\'s interface) <br> Router2# show ip route <br> Router2# ping 10.0.0.1 (Router1\'s interface) <br> PC1> ping 192.168.2.10 <br> PC2> ping 192.168.1.10'
            ],
            verification: [
                'Router1# show ip route',
                'Router2# show ip route',
                'PC1> ping 192.168.2.1',
                'PC1> ping 192.168.2.10',
                'PC1> tracert 192.168.2.10'
            ],
            commands: [
                '// Diagnose Routing Issue:',
                'Router1> enable',
                'Router1# show ip route',
                'Router1# ping 10.0.0.2 (Router2\'s interface)',
                'Router2# show ip route',
                'Router2# ping 10.0.0.1 (Router1\'s interface)',
                'PC1> ping 192.168.2.10',
                'PC2> ping 192.168.1.10',

                '// Configure Routes:',
                
                'Router1> enable',
                'Router1# configure terminal',
                'Router1(config)# router rip',
                'Router1(config-router)# network 192.168.1.0',
                'Router1(config-router)# network 10.0.0.0',
                
                'Router2> enable',
                'Router2# configure terminal',
                'Router2(config)# router rip',
                'Router2(config-router)# network 192.168.1.0',
                'Router2(config-router)# network 10.0.0.0',

                '// Test Connectivity:',
                'Router1> enable',
                'Router1# show ip route',
                'Router1# ping 10.0.0.2 (Router2\'s interface)',
                'Router2# show ip route',
                'Router2# ping 10.0.0.1 (Router1\'s interface)',
                'PC1> ping 192.168.2.10',
                'PC2> ping 192.168.1.10'
            ],
            simulation: 'Configure RIP or OSPF with incorrect network statements in Packet Tracer. Observe that routes are not being learned. Correct the configuration and verify that routes appear in the routing table.',
            simulation_pkt: 'L3NetworkLayer/l3-routing-protocol-misconfiguration/l3-routing-protocol-misconfiguration.pkt',
            screenshots: [
                { src: 'L3NetworkLayer/l3-routing-protocol-misconfiguration/l3-routing-protocol-misconfiguration-ss1.png', caption: 'Dynamic routing protocols are configured but not working properly due to configuration errors, version mismatches, or network statement issues.' },
                { src: 'L3NetworkLayer/l3-routing-protocol-misconfiguration/l3-routing-protocol-misconfiguration-ss2.png', caption: 'Dynamic routing protocols are configured but not working properly due to configuration errors, version mismatches, or network statement issues.' },
                { src: 'L3NetworkLayer/l3-routing-protocol-misconfiguration/l3-routing-protocol-misconfiguration-ss3.png', caption: 'Dynamic routing protocols are configured but not working properly due to configuration errors, version mismatches, or network statement issues.' },
                { src: 'L3NetworkLayer/l3-routing-protocol-misconfiguration/l3-routing-protocol-misconfiguration-ss4.png', caption: 'Dynamic routing protocols are configured but not working properly due to configuration errors, version mismatches, or network statement issues.' },
                { src: 'L3NetworkLayer/l3-routing-protocol-misconfiguration/l3-routing-protocol-misconfiguration-ss5.png', caption: 'Dynamic routing protocols are configured but not working properly due to configuration errors, version mismatches, or network statement issues.' },
            ]
        },
        'l3-acl-block': {
            title: 'L3 - ACL (Access Control List) Blocking Traffic',
            icon: 'fa-filter',
            definition: 'Access Control Lists are blocking legitimate traffic due to incorrect rule order, wrong permit/deny statements, or improper ACL placement.',
            causes: [
                'Restrictive ACL rules',
                'Incorrect ACL placement',
                'Incorrect rule order (deny before permit)',
                'ACL applied in incorrect direction (in vs out)',
                'Incorrect source/destination addresses in ACL',
                'Implicit deny all at end of ACL',
                'ACL applied to incorrect interface/direction',
                'Missing permit statements for return traffic'
            ],
            steps: [
                'Test Connectivity<br>PC1> ping 192.168.2.10 (should fail)<br>PC1> ping 8.8.8.8 (should work)',
                'Check ACL Configuration<br>Router1# show access-lists<br>Router1# show ip interface gig 0/0/0',
                'Fix ACL Configuration<br>Router1(config)# no access-list 100<br>Router1(config)# access-list 100 permit ip 192.168.1.0 0.0.0.255 192.168.2.0 0.0.0.255<br>Router1(config)# access-list 100 permit ip 192.168.2.0 0.0.0.255 192.168.1.0 0.0.0.255<br>Router1(config)# access-list 100 deny ip any any',
                'Alternative: Remove ACL if not needed<br>Router1(config)# interface gig 0/0/0<br>Router1(config-if)# no ip access-group 100 in<br>Router1(config-if)# exit<br>Router1(config)# no access-list 100<br>Router1(config)# end'
            ],
            verification: [
                'Router1# show access-lists',
                'PC1> ping 192.168.2.10'
            ],
            commands: [
                'Test Connectivity<br>PC1> ping 192.168.2.10 (should fail)<br>PC1> ping 8.8.8.8 (should work)',
                'Check ACL Configuration<br>Router1# show access-lists<br>Router1# show ip interface gig 0/0/0',
                'Fix ACL Configuration<br>Router1(config)# no access-list 100<br>Router1(config)# access-list 100 permit ip 192.168.1.0 0.0.0.255 192.168.2.0 0.0.0.255<br>Router1(config)# access-list 100 permit ip 192.168.2.0 0.0.0.255 192.168.1.0 0.0.0.255<br>Router1(config)# access-list 100 deny ip any any',
                'Alternative: Remove ACL if not needed<br>Router1(config)# interface gig 0/0/0<br>Router1(config-if)# no ip access-group 100 in<br>Router1(config-if)# exit<br>Router1(config)# no access-list 100<br>Router1(config)# end'
            ],
            simulation: 'Configure an ACL that blocks specific traffic in Packet Tracer. Test connectivity before and after applying the ACL. Modify the ACL to allow necessary traffic while still maintaining security.',
            simulation_pkt: 'L3NetworkLayer/l3-acl-blocking-traffic/l3-acl-blocking-traffic.pkt',
            screenshots: [
                { src: 'L3NetworkLayer/l3-acl-blocking-traffic/l3-acl-blocking-traffic-ss1.png', caption: 'Access Control Lists are blocking legitimate traffic due to incorrect rule order, wrong permit/deny statements, or improper ACL placement.' },
                { src: 'L3NetworkLayer/l3-acl-blocking-traffic/l3-acl-blocking-traffic-ss2.png', caption: 'Access Control Lists are blocking legitimate traffic due to incorrect rule order, wrong permit/deny statements, or improper ACL placement.' },
                { src: 'L3NetworkLayer/l3-acl-blocking-traffic/l3-acl-blocking-traffic-ss3.png', caption: 'Access Control Lists are blocking legitimate traffic due to incorrect rule order, wrong permit/deny statements, or improper ACL placement.' },
                { src: 'L3NetworkLayer/l3-acl-blocking-traffic/l3-acl-blocking-traffic-ss4.png', caption: 'Access Control Lists are blocking legitimate traffic due to incorrect rule order, wrong permit/deny statements, or improper ACL placement.' },
                { src: 'L3NetworkLayer/l3-acl-blocking-traffic/l3-acl-blocking-traffic-ss5.png', caption: 'Access Control Lists are blocking legitimate traffic due to incorrect rule order, wrong permit/deny statements, or improper ACL placement.' },
                { src: 'L3NetworkLayer/l3-acl-blocking-traffic/l3-acl-blocking-traffic-ss6.png', caption: 'Access Control Lists are blocking legitimate traffic due to incorrect rule order, wrong permit/deny statements, or improper ACL placement.' },
                { src: 'L3NetworkLayer/l3-acl-blocking-traffic/l3-acl-blocking-traffic-ss7.png', caption: 'Access Control Lists are blocking legitimate traffic due to incorrect rule order, wrong permit/deny statements, or improper ACL placement.' },
            ]
        },
        'l3-icmp-blocked': {
            title: 'L3 - ICMP Disabled or Blocked',
            icon: 'fa-ban',
            definition: 'Ping commands fail even though routing is correct, due to ICMP being disabled or blocked by security policies.',
            causes: [
                'ICMP blocked by ACL',
                'Firewall blocking ICMP packets',
                'ICMP disabled on router interfaces',
                'Security policy restrictions',
                'Router configured to not respond to ping'
            ],
            steps: [
                'Test Different Protocols: <br>PC2> ping 192.168.1.1 (ICMP - should fail)<br>PC2> telnet 192.168.1.1 (TCP - should work if telnet enabled)',
                'Check ICMP Settings: <br>Router1# show access-lists <br>Router1# show ip interface serial 0/1/0 <br>Router1# show access-lists 102',
                'Enable ICMP: <br>Router1(config)# interface serial 0/a0/0 <br>Router1(config-if)# no access-list 102<br>Router1(config)# access-list 102 permit ip any any'
            ],
            verification: [
                'Router1# show access-lists',
                'PC2> ping 192.168.1.1'
            ],
            commands: [
                'Test Different Protocols: <br>PC2> ping 192.168.1.1 (ICMP - should fail)<br>PC2> telnet 192.168.1.1 (TCP - should work if telnet enabled)',
                'Check ICMP Settings: <br>Router1# show access-lists <br>Router1# show ip interface serial 0/1/0 <br>Router1# show access-lists 102',
                'Enable ICMP: <br>Router1(config)# interface serial 0/a0/0 <br>Router1(config-if)# no access-list 102<br>Router1(config)# access-list 102 permit ip any any'
            ],
            simulation: 'Configure an ACL that blocks ICMP traffic in Packet Tracer. Verify that ping fails but other traffic (like HTTP) still works. Modify the ACL to allow ICMP and test ping again.',
            simulation_pkt: 'L3NetworkLayer/l3-icmp-disabled-or-blocked/l3-icmp-disabled-or-blocked.pkt',
            screenshots: [
                { src: 'L3NetworkLayer/l3-icmp-disabled-or-blocked/l3-icmp-disabled-or-blocked-ss1.png', caption: 'Ping commands fail even though routing is correct, due to ICMP being disabled or blocked by security policies.' },
                { src: 'L3NetworkLayer/l3-icmp-disabled-or-blocked/l3-icmp-disabled-or-blocked-ss2.png', caption: 'Ping commands fail even though routing is correct, due to ICMP being disabled or blocked by security policies.' },
                { src: 'L3NetworkLayer/l3-icmp-disabled-or-blocked/l3-icmp-disabled-or-blocked-ss3.png', caption: 'Ping commands fail even though routing is correct, due to ICMP being disabled or blocked by security policies.' },
                { src: 'L3NetworkLayer/l3-icmp-disabled-or-blocked/l3-icmp-disabled-or-blocked-ss4.png', caption: 'Ping commands fail even though routing is correct, due to ICMP being disabled or blocked by security policies.' },
                { src: 'L3NetworkLayer/l3-icmp-disabled-or-blocked/l3-icmp-disabled-or-blocked-ss5.png', caption: 'Ping commands fail even though routing is correct, due to ICMP being disabled or blocked by security policies.' },
                { src: 'L3NetworkLayer/l3-icmp-disabled-or-blocked/l3-icmp-disabled-or-blocked-ss6.png', caption: 'Ping commands fail even though routing is correct, due to ICMP being disabled or blocked by security policies.' },
                { src: 'L3NetworkLayer/l3-icmp-disabled-or-blocked/l3-icmp-disabled-or-blocked-ss7.png', caption: 'Ping commands fail even though routing is correct, due to ICMP being disabled or blocked by security policies.' },
            ]
        },
        'l3-routing-loop': {
            title: 'L3 - Routing Loop',
            icon: 'fa-sync-alt',
            definition: 'Packets continuously circulate between routers due to incorrect routing configurations, causing network congestion and preventing proper communication.',
            causes: [
                'Inconsistent routing tables',
                'Static route conflicts',
                'Routing protocol convergence issues',
                'Administrative distance problems',
                'Redistribution loops between protocols'
            ],
            steps: [
                'Identify the Loop: <br>PC1> tracert 192.168.2.10 <br>PC1> ping 192.168.2.10',
                'Analyze Routing Tables: <br>Router1# show ip route<br>Router2# show ip route<br>Router3# show ip route',
                'Fix Routing Configuration: <br>Router1(config)# no ip route 192.168.2.0 255.255.255.0 10.0.1.2<br>Router1(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.2',
            ],
            verification: [
                'PC1> tracert 192.168.2.10',
                'PC1> ping 192.168.2.10',
                'Router> show ip route'
            ],
            commands: [
                'PC1> tracert 192.168.2.10',
                'PC1> ping 192.168.2.10',
                'Router> show ip route',
                'Router1(config)# no ip route 192.168.2.0 255.255.255.0 10.0.1.2',
                'Router1(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.2'
            ],
            simulation: 'Create a network with conflicting static routes in Packet Tracer that cause a routing loop. Use traceroute to identify the loop, then correct the routing configuration to eliminate the loop.',
            simulation_pkt: 'L3NetworkLayer/l3-routing-loop/l3-routing-loop.pkt',
            screenshots: [
                { src: 'L3NetworkLayer/l3-routing-loop/l3-routing-loop-ss1.png', caption: 'Packets continuously circulate between routers due to incorrect routing configurations, causing network congestion and preventing proper communication.' },
                { src: 'L3NetworkLayer/l3-routing-loop/l3-routing-loop-ss2.png', caption: 'Packets continuously circulate between routers due to incorrect routing configurations, causing network congestion and preventing proper communication.' },
                { src: 'L3NetworkLayer/l3-routing-loop/l3-routing-loop-ss3.png', caption: 'Packets continuously circulate between routers due to incorrect routing configurations, causing network congestion and preventing proper communication.' },
                { src: 'L3NetworkLayer/l3-routing-loop/l3-routing-loop-ss4.png', caption: 'Packets continuously circulate between routers due to incorrect routing configurations, causing network congestion and preventing proper communication.' },
                { src: 'L3NetworkLayer/l3-routing-loop/l3-routing-loop-ss5.png', caption: 'Packets continuously circulate between routers due to incorrect routing configurations, causing network congestion and preventing proper communication.' },
                { src: 'L3NetworkLayer/l3-routing-loop/l3-routing-loop-ss6.png', caption: 'Packets continuously circulate between routers due to incorrect routing configurations, causing network congestion and preventing proper communication.' },
                { src: 'L3NetworkLayer/l3-routing-loop/l3-routing-loop-ss7.png', caption: 'Packets continuously circulate between routers due to incorrect routing configurations, causing network congestion and preventing proper communication.' },
                { src: 'L3NetworkLayer/l3-routing-loop/l3-routing-loop-ss8.png', caption: 'Packets continuously circulate between routers due to incorrect routing configurations, causing network congestion and preventing proper communication.' },
                { src: 'L3NetworkLayer/l3-routing-loop/l3-routing-loop-ss9.png', caption: 'Packets continuously circulate between routers due to incorrect routing configurations, causing network congestion and preventing proper communication.' },
                { src: 'L3NetworkLayer/l3-routing-loop/l3-routing-loop-ss10.png', caption: 'Packets continuously circulate between routers due to incorrect routing configurations, causing network congestion and preventing proper communication.' },
                { src: 'L3NetworkLayer/l3-routing-loop/l3-routing-loop-ss11.png', caption: 'Packets continuously circulate between routers due to incorrect routing configurations, causing network congestion and preventing proper communication.' },
                { src: 'L3NetworkLayer/l3-routing-loop/l3-routing-loop-ss12.png', caption: 'Packets continuously circulate between routers due to incorrect routing configurations, causing network congestion and preventing proper communication.' },
                { src: 'L3NetworkLayer/l3-routing-loop/l3-routing-loop-ss13.png', caption: 'Packets continuously circulate between routers due to incorrect routing configurations, causing network congestion and preventing proper communication.' },
                { src: 'L3NetworkLayer/l3-routing-loop/l3-routing-loop-ss14.png', caption: 'Packets continuously circulate between routers due to incorrect routing configurations, causing network congestion and preventing proper communication.' },
                { src: 'L3NetworkLayer/l3-routing-loop/l3-routing-loop-ss15.png', caption: 'Packets continuously circulate between routers due to incorrect routing configurations, causing network congestion and preventing proper communication.' },
                { src: 'L3NetworkLayer/l3-routing-loop/l3-routing-loop-ss16.png', caption: 'Packets continuously circulate between routers due to incorrect routing configurations, causing network congestion and preventing proper communication.' },
                { src: 'L3NetworkLayer/l3-routing-loop/l3-routing-loop-ss17.png', caption: 'Packets continuously circulate between routers due to incorrect routing configurations, causing network congestion and preventing proper communication.' },
                { src: 'L3NetworkLayer/l3-routing-loop/l3-routing-loop-ss18.png', caption: 'Packets continuously circulate between routers due to incorrect routing configurations, causing network congestion and preventing proper communication.' },
                { src: 'L3NetworkLayer/l3-routing-loop/l3-routing-loop-ss19.png', caption: 'Packets continuously circulate between routers due to incorrect routing configurations, causing network congestion and preventing proper communication.' },
                { src: 'L3NetworkLayer/l3-routing-loop/l3-routing-loop-ss20.png', caption: 'Packets continuously circulate between routers due to incorrect routing configurations, causing network congestion and preventing proper communication.' },
                { src: 'L3NetworkLayer/l3-routing-loop/l3-routing-loop-ss21.png', caption: 'Packets continuously circulate between routers due to incorrect routing configurations, causing network congestion and preventing proper communication.' },
                { src: 'L3NetworkLayer/l3-routing-loop/l3-routing-loop-ss22.png', caption: 'Packets continuously circulate between routers due to incorrect routing configurations, causing network congestion and preventing proper communication.' },
                { src: 'L3NetworkLayer/l3-routing-loop/l3-routing-loop-ss23.png', caption: 'Packets continuously circulate between routers due to incorrect routing configurations, causing network congestion and preventing proper communication.' },
            ]
        },
        'l3-ip-conflict': {
            title: 'L3 - IP Address Conflict (No PT Simulation)',
            icon: 'fa-exclamation-triangle',
            definition: 'Multiple devices configured with the same IP address causing intermittent connectivity issues and ARP table confusion.',
            causes: [
                'Manual IP configuration errors',
                'DHCP scope overlap',
                'Static IP assignments conflicting with DHCP',
                'Duplicate IP addresses on different subnets',
                'Configuration mistakes'
            ],
            steps: [
                'Check ARP table for duplicate entries with "show arp"',
                'View PC ARP cache with "arp -a"',
                'Check MAC address table with "show mac address-table"',
                'Identify conflicting devices by checking ARP table for duplicate IPs',
                'Reconfigure IP addresses to resolve conflicts',
                'Configure DHCP exclusions for static IP addresses using "ip dhcp excluded-address [start_ip] [end_ip]"',
                'Verify unique IP assignments',
                'Check ARP table for conflicts after changes'
            ],
            verification: [
                'PC1> ping 192.168.1.20 (should be consistent)',
                'PC1> arp -a (should show correct MAC addresses)',
                'Switch1# show mac address-table',
                'Router1# show arp',
                'PC1> ping 192.168.1.20',
            ],
            commands: [
                'PC1> ping 192.168.1.10',
                'PC1> arp -a',
                'Switch1# show mac address-table',
                'Router1# show arp',
                'PC1> arp -d *',
                'Router1# clear arp',
                'PC1> ping 192.168.1.20',
            ],
            simulation: 'Configure two devices with the same IP address in Packet Tracer. Observe the communication issues that result. Use ARP to identify the conflict, then reconfigure one device with a unique IP address.',
            simulation_pkt: '#',
            screenshots: [
                { src: 'L3NetworkLayer/l3-ip-address-conflict/l3-ip-address-conflict-ss1.png', caption: 'Multiple devices configured with the same IP address causing intermittent connectivity issues and ARP table confusion.' },
                { src: 'L3NetworkLayer/l3-ip-address-conflict/l3-ip-address-conflict-ss2.png', caption: 'Multiple devices configured with the same IP address causing intermittent connectivity issues and ARP table confusion.' },
                { src: 'L3NetworkLayer/l3-ip-address-conflict/l3-ip-address-conflict-ss3.png', caption: 'Multiple devices configured with the same IP address causing intermittent connectivity issues and ARP table confusion.' },
            ]
        }
    },
    // --- L4 Content --- 
    ...{
    'l4-port-blocking': {
        title: 'L4 - TCP Port Blocked by ACL or Firewall',
        icon: 'fas fa-shield-alt',
        definition: 'Applications cannot establish TCP connections due to Access Control Lists (ACLs) or firewall rules blocking specific TCP ports, preventing proper client-server communication.',
        causes: [
            'ACL denying specific TCP ports (80, 443, 23, 22, etc.)',
            'Extended ACL blocking port ranges',
            'Firewall rules blocking outbound/inbound connections',
            'Wrong ACL direction (in vs out)',
            'Implicit deny blocking return traffic'
        ],
        steps: [
            'Test TCP Connectivity: Ping destination IP (should work - ICMP allowed). Try HTTP and Telnet (should fail).',
            'Identify Blocked Ports: Check access-lists and ip interface on R1.',
            'Fix ACL Configuration: Remove existing ACL and reconfigure to permit necessary TCP ports (80, 23) and all IP traffic.',
            'Alternative: Remove ACL completely from the interface.'
        ],
        verification: [
            'Verify ACLs on R1.',
            'Open web browser to 192.168.2.10 (should work).',
            'Telnet to 192.168.2.10 (should work).'
        ],
        commands: [
            'R1(config)# access-list 100 deny tcp any any eq 80',
            'R1(config)# access-list 100 deny tcp any any eq 23',
            'R1(config)# access-list 100 permit ip any any',
            'R1(config)# interface serial 0/0/0',
            'R1(config-if)# ip access-group 100 out',
            'PC1> ping 192.168.2.10',
            'R1# show access-lists',
            'R1# show ip interface serial 0/0/0',
            'R1(config)# no access-list 100',
            'R1(config)# access-list 100 permit tcp any any eq 80',
            'R1(config)# access-list 100 permit tcp any any eq 23',
            'R1(config)# access-list 100 permit ip any any',
            'R1(config)# interface serial 0/0/0',
            'R1(config-if)# no ip access-group 100 out'
        ],
        simulation: 'Configure R1 with an ACL that denies TCP ports 80 and 23 for outbound traffic on serial 0/0/0. Attempt to access HTTP and Telnet services from PC1 to the Server at 192.168.2.10. Observe connection failures. Then, remove or modify the ACL to permit these ports and re-test.',
        simulation_pkt: '#',
        screenshots: []
    },
    'l4-udp-failure': {
        title: 'L4 - UDP Communication Fails (DNS, TFTP, DHCP)',
        icon: 'fas fa-exclamation-triangle',
        definition: 'UDP-based services like DNS, TFTP, and DHCP fail to function properly due to blocked UDP ports, incorrect server configuration, or missing protocol support.',
        causes: [
            'UDP ports blocked by ACL (53 for DNS, 69 for TFTP, 67/68 for DHCP)',
            'DNS server not configured or unreachable',
            'TFTP server not running or misconfigured',
            'DHCP server not responding to requests',
            'Broadcast traffic blocked'
        ],
        steps: [
            'Test UDP Services: Try nslookup and configure PC to get IP via DHCP (should fail).',
            'Check UDP Port Blocking: Show access-lists and ip interface on R1.',
            'Fix ACL for UDP Services: Remove existing ACL and reconfigure to permit necessary UDP ports (53, 69, 67, 68) and all IP traffic.',
            'Configure Server Services Properly: Ensure DNS has correct domain entries, TFTP has test files, and DHCP has correct IP pool.'
        ],
        verification: [
            'Release and renew IP on PC1 (should get DHCP IP).',
            'Nslookup www.cisco.com (should work).',
            'Copy file via TFTP from server (should work).'
        ],
        commands: [
            'R1(config)# access-list 101 deny udp any any eq 53',
            'R1(config)# access-list 101 deny udp any any eq 69',
            'R1(config)# access-list 101 deny udp any any eq 67',
            'R1(config)# access-list 101 deny udp any any eq 68',
            'R1(config)# access-list 101 permit ip any any',
            'R1(config)# interface fa0/0',
            'R1(config-if)# ip access-group 101 in',
            'PC1> nslookup www.example.com',
            'R1# show access-lists 101',
            'R1# show ip interface fa0/0',
            'R1(config)# no access-list 101',
            'R1(config)# access-list 101 permit udp any any eq 53',
            'R1(config)# access-list 101 permit udp any any eq 69',
            'R1(config)# access-list 101 permit udp any any eq 67',
            'R1(config)# access-list 101 permit udp any any eq 68',
            'R1(config)# access-list 101 permit ip any any',
            'PC1> ipconfig /release',
            'PC1> ipconfig /renew',
            'PC1> nslookup www.cisco.com'
        ],
        simulation: 'Configure R1 with an ACL that denies UDP ports 53, 69, 67, and 68 for inbound traffic on fa0/0. Attempt to use DNS, TFTP, and DHCP services from a PC. Observe failures. Then, remove or modify the ACL to permit these ports and ensure server services are properly configured, then re-test.',
        simulation_pkt: '#',
        screenshots: []
    },
    'l4-tcp-handshake-incomplete': {
        title: 'L4 - TCP Three-Way Handshake Incomplete',
        icon: 'fas fa-handshake',
        definition: 'TCP connections fail to establish due to incomplete three-way handshake process, causing applications to timeout during connection attempts.',
        causes: [
            'Server not responding to SYN packets',
            'Client not sending ACK after SYN-ACK',
            'Firewall dropping SYN packets',
            'Server application not listening on port',
            'Network congestion causing packet loss'
        ],
        steps: [
            'Test TCP Connection: Telnet to server on port 80 (connection should start but not complete).',
            'Analyze Packet Flow: Use Packet Tracer simulation mode to observe SYN, SYN-ACK, ACK exchange and identify where handshake fails.',
            'Fix ACL Configuration: Remove existing ACL and reconfigure to permit all TCP traffic and all IP traffic.',
            'Verify Server Service: Ensure HTTP service is enabled on Server, it is listening on the correct port, and no local firewall is blocking connections.'
        ],
        verification: [
            'Telnet to 192.168.2.10 80 (should work).',
            'Open web browser to 192.168.2.10 (should work).',
            'Use simulation mode to verify complete handshake.'
        ],
        commands: [
            'R1(config)# access-list 102 permit tcp any any eq 80',
            'R1(config)# access-list 102 deny tcp any any established',
            'R1(config)# access-list 102 permit ip any any',
            'R1(config)# interface serial 0/0/0',
            'R1(config-if)# ip access-group 102 out',
            'PC1> telnet 192.168.2.10 80',
            'R1(config)# no access-list 102',
            'R1(config)# access-list 102 permit tcp any any',
            'R1(config)# access-list 102 permit ip any any'
        ],
        simulation: 'Configure R1 with an ACL that permits TCP port 80 but denies established connections, applied outbound on serial 0/0/0. Attempt a TCP connection from PC1 to the Server. Observe the incomplete three-way handshake in simulation mode. Then, fix the ACL to allow established connections and re-test.',
        simulation_pkt: '#',
        screenshots: []
    },
    'l4-server-app-not-listening': {
        title: 'L4 - Server Application Not Listening on Correct Port',
        icon: 'fas fa-server',
        definition: 'Client applications cannot connect to server because the server application is not running, disabled, or listening on a different port than expected.',
        causes: [
            'Server service disabled or stopped',
            'Application configured to listen on wrong port',
            'Service binding to wrong network interface',
            'Server application crashed or not started',
            'Port conflicts with other services'
        ],
        steps: [
            'Test Server Connectivity: Ping server (should work), telnet to server (should fail), try web browser (should fail).',
            'Check Server Configuration: Click on Server in Packet Tracer, go to Services tab, check enabled/disabled services and port numbers.',
            'Enable Required Services: Enable HTTP (port 80), Telnet (port 23), FTP (port 21) services with proper settings.',
            'Verify Port Configuration: Ensure services are listening on standard ports (HTTP: 80, HTTPS: 443, Telnet: 23, SSH: 22, FTP: 21).'
        ],
        verification: [
            'Telnet to 192.168.1.100 (should connect).',
            'Open web browser to 192.168.1.100 (should show webpage).',
            'FTP to 192.168.1.100 (should connect).'
        ],
        commands: [
            'PC1> ping 192.168.1.100',
            'PC1> telnet 192.168.1.100'
        ],
        simulation: 'In Packet Tracer, configure a server with HTTP, Telnet, and FTP services disabled. Attempt to connect to these services from a client PC. Observe connection failures. Then, enable the services and verify connectivity.',
        simulation_pkt: '#',
        screenshots: []
    },
    'l4-client-port-mismatch': {
        title: 'L4 - Misconfigured Port Number on Client Side',
        icon: 'fas fa-desktop',
        definition: 'Client applications fail to connect because they are configured to use wrong port numbers, or custom applications are trying to connect to default ports.',
        causes: [
            'Client configured with wrong destination port',
            'Application expecting non-standard port numbers',
            'Port number typos in client configuration',
            'Client using old port configuration after server changes'
        ],
        steps: [
            'Identify Port Mismatch: Telnet to server using standard ports (should fail).',
            'Check Server Port Configuration: Go to Server -> Services tab and note actual port numbers being used. Document all active services and their ports.',
            'Use Correct Port Numbers: Telnet to server using the correct custom ports (e.g., 8080 for HTTP, 2323 for Telnet).',
            'Configure Client Applications: Use correct port numbers in web browser (e.g., http://192.168.1.100:8080) and telnet commands.',
            'Alternative Solution: Standardize Ports: Reconfigure server to use standard ports (e.g., HTTP on 80, Telnet on 23).'
        ],
        verification: [
            'Telnet to 192.168.1.100 8080 (should connect).',
            'Open browser to 192.168.1.100:8080 (should work).',
            'Test all services with correct port numbers.'
        ],
        commands: [
            'PC1> telnet 192.168.1.100 80',
            'PC1> telnet 192.168.1.100 23',
            'PC1> telnet 192.168.1.100 8080',
            'PC1> telnet 192.168.1.100 2323'
        ],
        simulation: 'Configure a server with HTTP on port 8080 and Telnet on port 2323. From a client PC, attempt to connect to these services using their standard ports (80 and 23). Observe connection failures. Then, attempt to connect using the correct custom ports and verify successful connections.',
        simulation_pkt: '#',
        screenshots: []
    },
    'l4-excessive-retransmissions': {
        title: 'L4 - Excessive TCP Retransmissions / Congestion',
        icon: 'fas fa-redo',
        definition: 'Network performance degrades due to TCP retransmissions caused by packet loss, high latency, or network congestion, leading to slow or failed connections.',
        causes: [
            'High network latency causing timeouts',
            'Packet loss due to congestion',
            'Buffer overflow on network devices',
            'Bandwidth limitations',
            'Duplex mismatches causing collisions'
        ],
        steps: [
            'Identify Performance Issues: Ping destination IP (check for high latency), tracert to destination IP (identify slow hops). Test file transfer speeds and monitor connection establishment times.',
            'Check Interface Statistics: Show interface and show ip interface brief on router. Look for input/output errors, drops, and buffer overruns.',
            'Optimize Network Configuration: Increase bandwidth and remove delay on serial interfaces. Set duplex to full and speed to 100 on FastEthernet interfaces.',
            'Implement QoS (if available): Configure access-list and class-map for specific traffic (e.g., HTTP).' 
        ],
        verification: [
            'Ping destination IP (should show improved latency).',
            'Show interface serial 0/0/0 (check for reduced errors).',
            'Test file transfer speeds (should be improved).'
        ],
        commands: [
            'R1(config)# interface serial 0/0/0',
            'R1(config-if)# bandwidth 64',
            'R1(config-if)# delay 1000',
            'R2(config)# interface serial 0/0/1',
            'R2(config-if)# bandwidth 64',
            'R2(config-if)# delay 1000',
            'PC1> ping 192.168.2.10',
            'PC1> tracert 192.168.2.10',
            'R1# show interface serial 0/0/0',
            'R1# show ip interface brief',
            'R1(config)# interface serial 0/0/0',
            'R1(config-if)# bandwidth 1544',
            'R1(config-if)# no delay',
            'R1(config)# interface fa0/0',
            'R1(config-if)# duplex full',
            'R1(config-if)# speed 100',
            'R1(config)# access-list 120 permit tcp any any eq 80',
            'R1(config)# class-map HTTP-TRAFFIC',
            'R1(config-cmap)# match access-group 120'
        ],
        simulation: 'Configure two routers with low-bandwidth serial links and high delay. Generate traffic from multiple PCs and servers to create a bottleneck. Observe high latency and slow file transfers. Then, optimize network configuration by increasing bandwidth and removing delay, and re-test.',
        simulation_pkt: '#',
        screenshots: []
    },
    'l4-port-translation-errors': {
        title: 'L4 - Port Translation (PAT/NAT) Errors',
        icon: 'fas fa-exchange-alt',
        definition: 'Network Address Translation (NAT) or Port Address Translation (PAT) misconfiguration prevents proper port mapping, causing connection failures for internal clients accessing external services.',
        causes: [
            'NAT pool exhaustion',
            'Incorrect NAT translation rules',
            'PAT not configured for specific ports',
            'Static NAT conflicts with dynamic NAT',
            'NAT translation timeouts'
        ],
        steps: [
            'Test NAT Translation: Ping external IP from multiple internal clients (first client may work, subsequent may fail due to pool exhaustion).',
            'Check NAT Translations: Show ip nat translations and show ip nat statistics on router.',
            'Configure PAT (Overload): Remove existing NAT pool configuration and reconfigure with \'overload\' keyword for PAT.',
            'Configure Static NAT for Servers: Configure static NAT for specific internal servers to be accessible from outside.',
            'Verify NAT Configuration: Show running-config | section nat and show ip nat translations.'
        ],
        verification: [
            'Ping external IP from all internal clients (should work).',
            'Show ip nat translations (verify multiple clients).',
            'Ping static NAT external IP from external client (test static NAT).'
        ],
        commands: [
            'R1(config)# access-list 1 permit 192.168.1.0 0.0.0.255',
            'R1(config)# ip nat pool NAT-POOL 203.0.113.1 203.0.113.1 netmask 255.255.255.0',
            'R1(config)# ip nat inside source list 1 pool NAT-POOL',
            'R1(config)# interface fa0/0',
            'R1(config-if)# ip nat inside',
            'R1(config)# interface fa0/1',
            'R1(config-if)# ip nat outside',
            'PC1> ping 8.8.8.8',
            'PC2> ping 8.8.8.8',
            'R1# show ip nat translations',
            'R1# show ip nat statistics',
            'R1(config)# no ip nat inside source list 1 pool NAT-POOL',
            'R1(config)# ip nat inside source list 1 interface fa0/1 overload',
            'R1(config)# ip nat inside source static 192.168.1.100 203.0.113.10',
            'R1# show running-config | section nat'
        ],
        simulation: 'Configure a router with NAT pool that is too small for multiple internal clients. Attempt to access an external service from multiple internal clients. Observe that some clients may fail to get NAT translations. Then, reconfigure NAT to use PAT (overload) or static NAT as needed, and verify successful access for all clients.',
        simulation_pkt: '#',
        screenshots: []
    },
    'l4-stateful-firewall-blocks-return': {
        title: 'L4 - Stateful Firewall Blocks Return Traffic',
        icon: 'fas fa-fire-alt',
        definition: 'Stateful firewalls or ACLs block return traffic for outbound connections, preventing proper bidirectional communication even when outbound traffic is allowed.',
        causes: [
            'ACL permits outbound but not return traffic',
            'Stateful inspection not configured properly',
            'Session timeouts too short',
            'Asymmetric routing breaking stateful tracking'
        ],
        steps: [
            'Test Connectivity: Telnet to server (connection attempts should fail, outbound packets allowed but return blocked).',
            'Check ACL Configuration: Show access-lists and show ip interface on router.',
            'Configure Stateful ACL: Remove existing ACL and reconfigure to permit outbound TCP and established inbound TCP traffic, and all IP traffic.',
            'Alternative: Use Reflexive ACL (if supported).'
        ],
        verification: [
            'Telnet to 192.168.2.10 80 (should work).',
            'Ping 192.168.2.10 (should work).',
            'Show access-lists (verify hit counts).'
        ],
        commands: [
            'R1(config)# access-list 110 permit tcp 192.168.1.0 0.0.0.255 any',
            'R1(config)# access-list 110 deny tcp any 192.168.1.0 0.0.0.255',
            'R1(config)# access-list 110 permit ip any any',
            'R1(config)# interface fa0/1',
            'R1(config-if)# ip access-group 110 in',
            'PC1> telnet 192.168.2.10 80',
            'R1# show access-lists 110',
            'R1# show ip interface fa0/1',
            'R1(config)# no access-list 110',
            'R1(config)# access-list 110 permit tcp 192.168.1.0 0.0.0.255 any',
            'R1(config)# access-list 110 permit tcp any 192.168.1.0 0.0.0.255 established',
            'R1(config)# access-list 110 permit ip any any',
            'R1(config)# ip access-list extended OUTBOUND',
            'R1(config-ext-nacl)# permit tcp 192.168.1.0 0.0.0.255 any reflect TCP-REFLECT',
            'R1(config-ext-nacl)# exit',
            'R1(config)# ip access-list extended INBOUND',
            'R1(config-ext-nacl)# evaluate TCP-REFLECT',
            'R1(config-ext-nacl)# deny ip any any'
        ],
        simulation: 'Configure a router as a firewall with an ACL that permits outbound TCP traffic but explicitly denies inbound TCP return traffic. Attempt to establish a TCP connection from a client to a server through this firewall. Observe that the initial SYN packet is allowed, but the SYN-ACK from the server is blocked. Then, modify the ACL to allow established connections or use a reflexive ACL and verify successful communication.',
        simulation_pkt: '#',
        screenshots: []
    }
},
    // --- L5-7 Content --- 
    ...{
        'l5-session-timeout': {
            title: 'L5 - Session Timeout or Connection Reset',
            icon: 'fa-hourglass-end',
            definition: 'Active sessions between client and server terminate unexpectedly, causing application failures and data loss.',
            causes: [
                'Session timeout values set too low',
                'Network congestion causing packet loss',
                'Server overload terminating sessions',
                'Firewall dropping established connections',
                'TCP connection reset by peer'
            ],
            steps: [
                'Check Session Configuration: Verify session timeout settings on server',
                'Monitor Network Traffic: Use packet capture to identify connection resets',
                'Verify Server Resources: Check server CPU and memory usage',
                'Test Connection Stability: Use continuous ping and telnet tests',
                'Adjust Timeout Values: Increase session timeout parameters'
            ],
            verification: [
                'PC> ping [server-ip] -t',
                'PC> telnet [server-ip] 80',
                'Router> show ip route',
                'Router> show interfaces',
                'Server> netstat -an (if supported)'
            ],
            commands: [
                'PC> ping [server-ip] -t',
                'PC> telnet [server-ip] 80',
                'Router> show ip route',
                'Router> show interfaces',
                'Server> netstat -an (if supported)'
            ],
            simulation: 'Use Simple PDU to test initial connectivity, then use Complex PDU with HTTP to simulate session establishment. Monitor for dropped connections.',
            simulation_pkt: '#',
            screenshots: []
        },
        'l5-authentication-failures': {
            title: 'L5 - Authentication Failures',
            icon: 'fa-user-lock',
            definition: 'Users cannot authenticate to network services, preventing access to applications and resources.',
            causes: [
                'Incorrect username/password credentials',
                'Authentication server down or misconfigured',
                'Network connectivity issues to authentication server',
                'Time synchronization problems',
                'Account lockout policies'
            ],
            steps: [
                'Verify Credentials: Check username and password accuracy',
                'Test Authentication Server: Verify server connectivity and status',
                'Check AAA Configuration: Review authentication, authorization, accounting settings',
                'Synchronize Time: Ensure time consistency between client and server',
                'Review Logs: Check authentication logs for specific error messages'
            ],
            verification: [
                'Router> show aaa servers',
                'Router> show aaa sessions',
                'Router> debug aaa authentication',
                'Router> show clock',
                'Router> ntp server [ntp-server-ip]'
            ],
            commands: [
                'Router> show aaa servers',
                'Router> show aaa sessions',
                'Router> debug aaa authentication',
                'Router> show clock',
                'Router> ntp server [ntp-server-ip]'
            ],
            simulation: 'Configure AAA authentication on router, then test with different credentials to demonstrate authentication success and failure scenarios.',
            simulation_pkt: '#',
            screenshots: []
        },
        'l5-connection-state': {
            title: 'L5 - Connection State Problems',
            icon: 'fa-plug',
            definition: 'Sessions not properly established or maintained.',
            causes: [
                'Connection tracking issues',
                'State table overflow',
                'Asymmetric routing',
                'Firewall state inconsistencies'
            ],
            steps: [
                'Check connection state table (e.g., `show ip nat translations`, `show ip inspect sessions`).',
                'Verify firewall connection tracking.',
                'Adjust connection limits if needed (e.g., `ip nat translation max-entries [num]`, `ip inspect max-incomplete high [num]`).',
                'Ensure consistent routing paths.',
                'Monitor connection establishment and termination.'
            ],
            verification: [
                'Connection state table shows active sessions properly tracked',
                'No connection timeouts or unexpected session drops observed',
                'State table within configured limits (not overflowing)',
                'Symmetric routing confirmed for established connections'
            ],
            commands: [
                'Router> show ip nat translations',
                'Router> show ip inspect sessions',
                'Router(config)# ip nat translation max-entries 10000',
                'Router(config)# ip inspect max-incomplete high 400'
            ],
            simulation: 'Create a network with a stateful firewall in Packet Tracer. Generate a large number of connections to overflow the state table. Observe connection failures, then increase the connection limits and test again.',
            simulation_pkt: '#',
            screenshots: []
        },
        'unauthorized-network-access': {
            title: 'Unauthorized Network Access',
            icon: 'fa-user-lock',
            definition: 'Unauthorized users gain access to network resources, potentially compromising sensitive data and system integrity.',
            causes: [
                'Weak authentication mechanisms',
                'Missing access control lists',
                'Inadequate user privilege management',
                'Lack of network access control (NAC)',
                'Poor physical security'
            ],
            steps: [
                'Implement 802.1X: Deploy port-based network access control',
                'Configure ACLs: Implement access control lists',
                'User Authentication: Deploy strong authentication mechanisms',
                'Network Segmentation: Separate network segments by function',
                'Monitoring: Implement access monitoring and logging'
            ],
            verification: [
                'Switch(config)# dot1x system-auth-control',
                'Switch(config-if)# dot1x port-control auto',
                'Router(config)# access-list 101 permit tcp 192.168.1.0 0.0.0.255 host 10.0.0.1 eq 80',
                'Router(config)# access-list 101 deny ip any any',
                'Router(config-if)# ip access-group 101 in',
                'Switch> show dot1x all',
                'Router> show access-lists'
            ],
            commands: [
                'Switch(config)# dot1x system-auth-control',
                'Switch(config-if)# dot1x port-control auto',
                'Router(config)# access-list 101 permit tcp 192.168.1.0 0.0.0.255 host 10.0.0.1 eq 80',
                'Router(config)# access-list 101 deny ip any any',
                'Router(config-if)# ip access-group 101 in',
                'Switch> show dot1x all',
                'Router> show access-lists'
            ],
            simulation: 'Configure access controls, test authorized and unauthorized access attempts, implement proper authentication.',
            simulation_pkt: '#',
            screenshots: []
        },
        'security-access-control': {
            title: 'Cyber Security - Access Control Issues',
            icon: 'fa-key',
            definition: 'Managing and securing network access permissions.',
            causes: [
                'Weak authentication mechanisms',
                'Excessive user privileges',
                'Shared credentials',
                'Lack of access review processes'
            ],
            steps: [
                'Implement strong authentication methods (`username [user] privilege [level] secret [pass]`).',
                'Configure role-based access control.',
                'Enforce principle of least privilege.',
                'Implement network segmentation.',
                'Regularly audit user accounts and permissions.',
                'Configure account lockout policies.',
                'Monitor for unusual access patterns.'
            ],
            verification: [
                'Authentication Status: Confirm strong authentication mechanisms are enforced',
                'Permission Levels: Verify users have appropriate privilege levels assigned',
                'Access Monitoring: Check for unauthorized access attempts and account security'
            ],
            commands: [
                'Router(config)# username admin privilege 15 secret strong-password',
                'Router(config)# aaa new-model',
                'Router(config)# aaa authentication login default local',
                'Router(config)# aaa authorization exec default local',
                'Router(config)# line vty 0 4',
                'Router(config-line)# login authentication default',
                'Router(config-line)# transport input ssh'
            ],
            simulation: 'Configure various access control mechanisms in Packet Tracer. Test different authentication methods and permission levels. Attempt unauthorized access and observe how the security measures respond.',
            simulation_pkt: '#',
            screenshots: []
        },
        'l6-encryption-problems': {
            title: 'L6 - Encryption Problems (SSL/TLS)',
            icon: 'fa-lock',
            definition: 'Secure connections fail to establish due to SSL/TLS certificate issues or encryption mismatches.',
            causes: [
                'Expired SSL certificates',
                'Certificate authority not trusted',
                'Encryption algorithm mismatches',
                'Weak cipher suites',
                'Certificate hostname mismatch'
            ],
            steps: [
                'Check Certificate Validity: Verify certificate expiration and issuer',
                'Verify Certificate Chain: Ensure complete certificate chain is present',
                'Test Encryption Compatibility: Check supported cipher suites',
                'Update Certificates: Install new or renewed certificates',
                'Configure Proper Encryption: Set appropriate encryption levels'
            ],
            verification: [
                'PC> nslookup [server-name]',
                'Router> show crypto pki certificates',
                'Router> show crypto pki trustpoints',
                'Server> show ssl certificate (if available)'
            ],
            commands: [
                'PC> nslookup [server-name]',
                'Router> show crypto pki certificates',
                'Router> show crypto pki trustpoints',
                'Server> show ssl certificate (if available)'
            ],
            simulation: 'Configure web server with HTTPS, test both successful and failed SSL connections using web browser simulation.',
            simulation_pkt: '#',
            screenshots: []
        },
        'l6-data-format-errors': {
            title: 'L6 - Data Format Errors',
            icon: 'fa-file-code',
            definition: 'Applications cannot process data due to format incompatibilities or corruption during transmission.',
            causes: [
                'Character encoding mismatches (ASCII, UTF-8, etc.)',
                'Data compression/decompression errors',
                'File format corruption',
                'Protocol version incompatibilities',
                'Byte order (endianness) issues'
            ],
            steps: [
                'Verify Data Encoding: Check character set and encoding settings',
                'Test File Integrity: Verify file checksums and integrity',
                'Check Protocol Versions: Ensure compatible protocol versions',
                'Validate Data Format: Confirm proper data structure and format',
                'Configure Proper Encoding: Set appropriate encoding standards'
            ],
            verification: [
                'PC> ftp [server-ip]',
                'ftp> binary (for binary file transfer)',
                'ftp> ascii (for text file transfer)',
                'Router> show version',
                'PC> ping [server-ip]'
            ],
            commands: [
                'PC> ftp [server-ip]',
                'ftp> binary (for binary file transfer)',
                'ftp> ascii (for text file transfer)',
                'Router> show version',
                'PC> ping [server-ip]'
            ],
            simulation: 'Use FTP to transfer different file types, demonstrate successful transfers and format-related failures.',
            simulation_pkt: '#',
            screenshots: []
        },
        'l6-compression': {
            title: 'L6 - Compression Issues',
            icon: 'fa-compress-arrows-alt',
            definition: 'Data compression causing transmission or interpretation problems.',
            causes: [
                'Incompatible compression algorithms',
                'Resource constraints for decompression',
                'Corrupted compressed data',
                'Compression ratio issues'
            ],
            steps: [
                'Verify compression settings.',
                'Check for compatible algorithms.',
                'Test with different compression levels.',
                'Disable compression if causing issues (`no ip http compression`).',
                'Ensure sufficient resources for decompression.'
            ],
            verification: [
                'Compression Status: Verify compression algorithms are compatible and functioning',
                'Data Integrity: Check transmitted data is not corrupted during compression/decompression',
                'Resource Usage: Monitor CPU and memory consumption during compression operations'
            ],
            commands: [
                'Router(config)# no ip http compression',
                'Router(config)# ip tcp header-compression',
                'Router(config-if)# ip rtp header-compression'
            ],
            simulation: 'Configure a router with aggressive compression settings in Packet Tracer. Transfer large files and observe potential corruption or performance issues. Adjust compression settings and test again.',
            simulation_pkt: '#',
            screenshots: []
        },
        'network-based-malware-propagation': {
            title: 'Network-Based Malware Propagation',
            icon: 'fa-bug',
            definition: 'Malware spreads across the network, consuming bandwidth, compromising systems, and disrupting normal network operations.',
            causes: [
                'Lack of network segmentation',
                'Missing endpoint protection',
                'Inadequate traffic monitoring',
                'Weak access controls',
                'Insufficient patch management'
            ],
            steps: [
                'Network Segmentation: Implement VLANs and network isolation',
                'Traffic Analysis: Deploy network traffic monitoring tools',
                'Access Control: Implement strict access control policies',
                'Bandwidth Management: Configure QoS and traffic shaping',
                'Endpoint Protection: Deploy antimalware solutions'
            ],
            verification: [
                'Switch(config)# vlan 10',
                'Switch(config-vlan)# name Quarantine',
                'Switch(config-if)# switchport access vlan 10',
                'Router(config-if)# rate-limit output 100000 8000 8000',
                'Router> show interfaces',
                'Switch> show vlan brief',
                'PC> netstat -an'
            ],
            commands: [
                'Switch(config)# vlan 10',
                'Switch(config-vlan)# name Quarantine',
                'Switch(config-if)# switchport access vlan 10',
                'Router(config-if)# rate-limit output 100000 8000 8000',
                'Router> show interfaces',
                'Switch> show vlan brief',
                'PC> netstat -an'
            ],
            simulation: 'Configure network segmentation, simulate malware traffic patterns, and implement containment measures.',
            simulation_pkt: '#',
            screenshots: []
        },
        'security-malware': {
            title: 'Cyber Security - Malware Network Impact',
            icon: 'fa-virus',
            definition: 'Detecting and mitigating malware activity on the network.',
            causes: [
                'Infected devices on network',
                'Command and control (C2) communications',
                'Data exfiltration attempts',
                'Lateral movement within network'
            ],
            steps: [
                'Identify suspicious traffic patterns.',
                'Block known malicious domains and IPs using ACLs or domain lists (`ip domain-list block [domain]`).',
                'Implement DNS filtering.',
                'Configure network segmentation.',
                'Monitor for unusual data transfers.',
                'Deploy endpoint protection solutions.',
                'Regularly update security signatures.'
            ],
            verification: [
                'Traffic Analysis: Identify and block suspicious communication patterns',
                'Domain Blocking: Confirm malicious domains and IPs are filtered successfully',
                'Network Segmentation: Verify infected devices are isolated from critical systems'
            ],
            commands: [
                'Router(config)# ip domain-list block malicious-domain.com',
                'Router(config)# access-list 110 deny ip any host 192.168.1.100',
                'Router(config)# access-list 110 deny ip any 10.0.0.0 0.255.255.255',
                'Router(config)# interface fastethernet 0/0',
                'Router(config-if)# ip access-group 110 in'
            ],
            simulation: 'Simulate malware behavior in Packet Tracer by configuring a device to generate suspicious traffic patterns. Implement detection and prevention measures to identify and block the malicious activity.',
            simulation_pkt: '#',
            screenshots: []
        },
        'l7-dns-issues': {
            title: 'L7 - DNS Resolution Problems',
            icon: 'fa-globe',
            definition: 'Domain names cannot be resolved to IP addresses.',
            causes: [
                'DNS server IP incorrect',
                'DNS service not running',
                'DNS records missing or incorrect',
                'DNS server unreachable'
            ],
            steps: [
                'Test name resolution with `nslookup [domain_name]`.',
                'Try alternate DNS server with `nslookup [domain_name] [dns_server_ip]`.',
                'Check host table with `show hosts`.',
                'Configure DNS server settings (`ip dns server`, `ip name-server [dns_ip]`, `ip domain-lookup`).',
                'Set up DNS records if needed (`ip host [name] [ip]`).',
                'Configure client DNS settings.',
                'Test name resolution after changes.'
            ],
            verification: [
                'Name Resolution: Verify domain names resolve to correct IP addresses',
                'DNS Server Response: Confirm DNS queries return valid responses',
                'Alternative DNS: Test resolution using different DNS servers'
            ],
            commands: [
                'PC> nslookup www.google.com',
                'PC> nslookup www.google.com 8.8.8.8',
                'Router> show hosts',
                'Router(config)# ip dns server',
                'Router(config)# ip host www.example.com 192.168.1.100',
                'Router(config)# ip host mail.example.com 192.168.1.101',
                'Router(config)# ip name-server 8.8.8.8',
                'Router(config)# ip domain-lookup'
            ],
            simulation: 'Configure a PC with incorrect DNS server settings in Packet Tracer. Attempt to browse to a website using a domain name and observe the failure. Correct the DNS settings and test again.',
            simulation_pkt: '#',
            screenshots: []
        },
        'l7-http-errors': {
            title: 'L7 - HTTP/HTTPS Errors',
            icon: 'fa-server',
            definition: 'Web pages cannot be accessed.',
            causes: [
                'HTTP service disabled',
                'Web server application crashed',
                'Port 80/443 blocked',
                'Website files corrupted or missing'
            ],
            steps: [
                'Test connection to web server with `telnet [server_ip] [port]`.',
                'Try accessing website with web browser.',
                'Enable HTTP service on server (`ip http server`).',
                'Configure authentication if needed (`ip http authentication local`).',
                'Troubleshoot web content issues.',
                'Test with simple HTML page.',
                'Access website from different clients.',
                'Test both HTTP and HTTPS if configured.'
            ],
            verification: [
                'Web Service Status: Confirm HTTP/HTTPS service is active and responding',
                'Port Accessibility: Verify ports 80/443 are open and reachable',
                'Content Delivery: Check web pages load correctly in browser'
            ],
            commands: [
                'Router> telnet 192.168.1.100 80',
                'PC> Web Browser → http://192.168.1.100',
                'Router(config)# ip http server',
                'Router(config)# ip http authentication local',
                'Router(config)# username admin privilege 15 password cisco'
            ],
            simulation: 'Configure a server in Packet Tracer but don\'t enable the HTTP service. Attempt to access a web page on the server and observe the failure. Enable the HTTP service and test again.',
            simulation_pkt: '#',
            screenshots: []
        },
        'l7-email-issues': {
            title: 'L7 - Email Service Problems',
            icon: 'fa-envelope',
            definition: 'Email cannot be sent or received.',
            causes: [
                'Email server misconfiguration',
                'SMTP/POP3/IMAP ports blocked',
                'Authentication issues',
                'DNS MX record problems'
            ],
            steps: [
                'Verify email server is running.',
                'Check port accessibility for SMTP (25), POP3 (110), IMAP (143) using `telnet`.',
                'Configure email server settings.',
                'Set up DNS MX records if needed.',
                'Test email sending and receiving.',
                'Verify authentication settings.'
            ],
            verification: [
                'Email Server Status: Confirm SMTP/POP3/IMAP services are running',
                'Port Connectivity: Verify email ports (25, 110, 143) are accessible',
                'Message Flow: Test successful email sending and receiving'
            ],
            commands: [
                'Router> telnet 192.168.1.100 25',
                'Router> telnet 192.168.1.100 110',
                'Router> telnet 192.168.1.100 143'
            ],
            simulation: 'Configure an email server in Packet Tracer. Attempt to send and receive email without proper configuration and observe the failures. Configure the server correctly and test email functionality.',
            simulation_pkt: '#',
            screenshots: []
        },
        'l7-ftp-problems': {
            title: 'L7 - FTP Connection Issues',
            icon: 'fa-file-upload',
            definition: 'Cannot connect to FTP server or transfer files.',
            causes: [
                'FTP service not running',
                'Authentication failure',
                'Passive mode issues',
                'Directory permissions'
            ],
            steps: [
                'Test FTP connectivity with `telnet [server_ip] 21`.',
                'Verify FTP service is running.',
                'Check user authentication settings.',
                'Configure passive mode if needed.',
                'Set appropriate directory permissions.',
                'Test file upload and download using an FTP client.'
            ],
            verification: [
                'FTP Service Status: Confirm FTP server is running and accepting connections',
                'Authentication Success: Verify user credentials authenticate properly',
                'File Transfer: Test successful upload and download operations'
            ],
            commands: [
                'Router> telnet 192.168.1.100 21',
                'PC> ftp 192.168.1.100',
                'Username: admin',
                'Password: cisco',
                'ftp> put file.txt',
                'ftp> get file.txt',
                'ftp> quit'
            ],
            simulation: 'Configure an FTP server in Packet Tracer. Attempt to connect and transfer files without proper configuration and observe the failures. Configure the server correctly and test FTP functionality.',
            simulation_pkt: '#',
           screenshots: []
        },
        'l7-dhcp-server-not-responding': {
            title: 'L7 - DHCP Server Not Responding or Wrong Scope',
            icon: 'fa-network-wired',
            definition: 'Clients cannot obtain IP addresses automatically, or receive incorrect network configuration from DHCP server.',
            causes: [
                'DHCP server service down',
                'DHCP scope exhausted (no available IP addresses)',
                'Incorrect DHCP scope configuration',
                'Network connectivity issues to DHCP server',
                'DHCP relay agent misconfigured'
            ],
            steps: [
                'Check DHCP Service: Verify DHCP server service is running',
                'Review DHCP Scope: Check available IP addresses in pool',
                'Verify Network Connectivity: Test connectivity to DHCP server',
                'Check DHCP Configuration: Review scope settings and options',
                'Restart DHCP Service: Restart service if necessary'
            ],
            verification: [
                'PC> ipconfig /all',
                'PC> ipconfig /release',
                'PC> ipconfig /renew',
                'PC> ping [dhcp-server-ip]',
                'Router> show ip dhcp binding',
                'Router> show ip dhcp pool',
                'DHCP Server> show dhcp (if available)'
            ],
            commands: [
                'PC> ipconfig /all',
                'PC> ipconfig /release',
                'PC> ipconfig /renew',
                'PC> ping [dhcp-server-ip]',
                'Router> show ip dhcp binding',
                'Router> show ip dhcp pool',
                'DHCP Server> show dhcp (if available)'
            ],
            simulation: 'Configure DHCP server, test automatic IP assignment. Simulate scope exhaustion by limiting available IPs.',
            simulation_pkt: '#',
            screenshots: []
        },
        'l7-telnet-ssh-refused': {
            title: 'L7 - Telnet/SSH Connection Refused (Port 23/22)',
            icon: 'fa-terminal',
            definition: 'Remote access connections are rejected, preventing administrative access to network devices.',
            causes: [
                'Telnet/SSH service disabled',
                'Access control lists blocking connections',
                'Authentication configuration issues',
                'Port 22/23 blocked by firewall',
                'Maximum session limit reached'
            ],
            steps: [
                'Check Service Status: Verify Telnet/SSH is enabled',
                'Review VTY Configuration: Check virtual terminal line settings',
                'Verify Access Lists: Check for blocking ACLs',
                'Test Authentication: Verify login credentials',
                'Check Session Limits: Verify available VTY sessions'
            ],
            verification: [
                'PC> telnet [target-ip]',
                'PC> ssh [target-ip]',
                'PC> ping [target-ip]',
                'Router> show line vty 0 4',
                'Router> show access-lists',
                'Router> show users',
                'Router> line vty 0 4',
                'Router(config-line)> transport input telnet ssh'
            ],
            commands: [
                'PC> telnet [target-ip]',
                'PC> ssh [target-ip]',
                'PC> ping [target-ip]',
                'Router> show line vty 0 4',
                'Router> show access-lists',
                'Router> show users',
                'Router> line vty 0 4',
                'Router(config-line)> transport input telnet ssh'
            ],
            simulation: 'Configure remote access on router, test both successful and blocked connections.',
            simulation_pkt: '#',
            screenshots: []
        },       
        'ntp-amplification-attack': {
            title: 'NTP Amplification Attack',
            icon: 'fa-expand-arrows-alt',
            definition: 'Attackers exploit NTP servers to amplify DDoS attacks by sending small queries that generate large responses, overwhelming the target with amplified traffic.',
            causes: [
                'Open NTP servers with monlist enabled',
                'Lack of source IP validation (spoofing allowed)',
                'Insufficient rate limiting on NTP servers',
                'Inadequate network monitoring for anomalous NTP traffic',
                'Weak access controls on NTP servers'
            ],
            steps: [
                'Disable Monlist: Configure NTP servers to disable the monlist command',
                'Implement Source IP Validation: Enable uRPF on network devices',
                'Rate Limit NTP Traffic: Apply rate limits to NTP requests and responses',
                'Secure NTP Servers: Harden NTP server configurations and access controls',
                'Monitor NTP Traffic: Deploy tools to detect and alert on NTP amplification attempts'
            ],
            verification: [
                'PC> ntpdate -q [ntp-server-ip] (to check monlist status)',
                'Router(config-if)# ip verify unicast source reachable-via rx',
                'Router(config)# access-list 101 permit udp any any eq ntp\nRouter(config-if)# ip access-group 101 in',
                'Router> show ip interface brief',
                'NTP Server> show ntp associations (if available)'
            ],
            commands: [
                'PC> ntpdate -q [ntp-server-ip]',
                'Router(config-if)# ip verify unicast source reachable-via rx',
                'Router(config)# access-list 101 permit udp any any eq ntp\nRouter(config-if)# ip access-group 101 in',
                'Router> show ip interface brief',
                'NTP Server> show ntp associations (if available)'
            ],
            simulation: 'Configure NTP server, simulate NTP queries, then simulate amplification attack by sending spoofed requests and observing amplified responses.',
            simulation_pkt: '#',
            screenshots: []
        }
    },
    // --- Cyber Security Content --- 
    ...{
        'security-ddos': {
            title: 'Cyber Security - DDoS Attack Mitigation',
            icon: 'fa-umbrella-beach',
            definition: 'Distributed Denial of Service attacks overwhelm network resources.',
            causes: [
                'Coordinated attack from multiple sources',
                'Amplification attacks using DNS/NTP',
                'SYN flood attacks',
                'Application layer attacks'
            ],
            steps: [
                'Identify attack signatures and patterns.',
                'Implement traffic filtering at network edge using ACLs.',
                'Configure rate limiting for suspicious traffic (`rate-limit input ...`).',
                'Deploy traffic scrubbing services if available.',
                'Implement anti-spoofing measures.',
                'Configure SYN cookies for SYN flood protection (`ip tcp synwait-time`).',
                'Monitor traffic patterns for anomalies.'
            ],
            verification: [
                'Traffic Filtering: Confirm malicious traffic is blocked by ACLs and rate limiting',
                'Network Performance: Verify network resources remain available during attack',
                'Attack Detection: Monitor for DDoS attack patterns and mitigation effectiveness'
            ],
            commands: [
                'Router(config)# access-list 100 deny icmp any any echo-request',
                'Router(config)# interface fastethernet 0/0',
                'Router(config-if)# ip access-group 100 in',
                'Router(config)# ip tcp synwait-time 10',
                'Router(config)# interface fastethernet 0/0',
                'Router(config-if)# rate-limit input 1000000 8000 8000 conform-action transmit exceed-action drop'
            ],
            simulation: 'Configure a network in Packet Tracer and simulate a DDoS attack by generating excessive traffic from multiple sources. Implement mitigation techniques and observe the effectiveness in protecting network resources.',
            simulation_pkt: '#',
            screenshots: []
        },
        
        'security-intrusion': {
            title: 'Cyber Security - Intrusion Detection (IDS/IPS)',
            icon: 'fa-user-secret',
            definition: 'Detecting and preventing unauthorized network access attempts.',
            causes: [
                'Malicious scanning and probing',
                'Exploitation attempts',
                'Unauthorized access',
                'Policy violations'
            ],
            steps: [
                'Configure IDS/IPS sensors at key network points.',
                'Define signature-based detection rules (`ip inspect name [name] [protocol]`).',
                'Implement anomaly-based detection.',
                'Set up alerting and logging mechanisms (`logging host [ip]`, `logging trap notifications`).',
                'Configure appropriate response actions.',
                'Regularly update signatures and rules.',
                'Monitor and analyze security events.'
            ],
            verification: [
                'Detection Rules: Confirm IDS/IPS signatures are active and detecting threats',
                'Alerting System: Verify security events are logged and alerts are generated',
                'Response Actions: Check that intrusion attempts trigger appropriate countermeasures'
            ],
            commands: [
                'Router(config)# ip inspect name IDS tcp',
                'Router(config)# ip inspect name IDS udp',
                'Router(config)# interface fastethernet 0/0',
                'Router(config-if)# ip inspect IDS in',
                'Router(config)# logging host 192.168.1.100',
                'Router(config)# logging trap notifications'
            ],
            simulation: 'Configure IDS/IPS features in Packet Tracer. Simulate various intrusion attempts and observe how the system detects and responds to these security threats.',
            simulation_pkt: '#',
            screenshots: []
        },

        'security-phishing': {
            title: 'Cyber Security - Phishing Attack Prevention',
            icon: 'fa-fish',
            definition: 'Protecting users from social engineering and credential theft attempts.',
            causes: [
                'Fraudulent emails and websites',
                'Social engineering tactics',
                'Credential harvesting',
                'Malicious attachments and links'
            ],
            steps: [
                'Implement email filtering and scanning.',
                'Configure web filtering for known phishing sites (`ip domain-list block [domain]`).',
                'Deploy DNS-based protection.',
                'Educate users about phishing techniques.',
                'Implement multi-factor authentication.',
                'Monitor for unusual login attempts.',
                'Regularly test user awareness.'
            ],
            verification: [
                'Content Filtering: Confirm phishing sites and emails are blocked effectively',
                'DNS Protection: Verify malicious domains resolve to blocked addresses',
                'User Access: Check that legitimate services remain accessible while threats are filtered'
            ],
            commands: [
                'Router(config)# ip domain-list block phishing-site.com',
                'Router(config)# access-list 120 deny tcp any any eq 25',
                'Router(config)# interface fastethernet 0/0',
                'Router(config-if)# ip access-group 120 in'
            ],
            simulation: 'Create a simulated phishing scenario in Packet Tracer. Configure email and web filtering to detect and block phishing attempts. Test the effectiveness of the security measures.',
            simulation_pkt: '#',
            screenshots: []
        },

        'arp-spoofing': {
            title: 'ARP Spoofing (ARP Poisoning)',
            icon: 'fa-mask',
            definition: 'Attackers send fake ARP responses to associate their MAC address with another device\'s IP address, enabling man-in-the-middle attacks and traffic interception.',
            causes: [
                'Lack of ARP table security measures',
                'No dynamic ARP inspection configured',
                'Absence of static ARP entries for critical devices',
                'Unsecured switched network environment',
                'Missing network monitoring for ARP anomalies'
            ],
            steps: [
                'Enable Dynamic ARP Inspection: Configure DAI on switch ports',
                'Implement Static ARP Entries: Add static ARP entries for critical devices',
                'Monitor ARP Tables: Regularly check for suspicious ARP entries',
                'Port Security: Enable port security to limit MAC addresses per port',
                'Network Segmentation: Use VLANs to isolate network segments'
            ],
            verification: [
                'Switch> show arp',
                'Switch(config)# ip dhcp snooping',
                'Switch(config)# ip arp inspection vlan 1',
                'Switch(config-if)# ip arp inspection trust',
                'PC> arp -a',
                'PC> arp -d (to clear ARP cache)',
                'Switch> show ip dhcp snooping binding',
                'Switch> show ip arp inspection statistics'
            ],
            commands: [
                'Switch> show arp',
                'Switch(config)# ip dhcp snooping',
                'Switch(config)# ip arp inspection vlan 1',
                'Switch(config-if)# ip arp inspection trust',
                'PC> arp -a',
                'PC> arp -d (to clear ARP cache)',
                'Switch> show ip dhcp snooping binding',
                'Switch> show ip arp inspection statistics'
            ],
            simulation: 'Use Simple PDU to test normal communication, then simulate ARP spoofing by manually configuring fake ARP entries. Monitor traffic flow changes.',
            simulation_pkt: '#',
            screenshots: []
        },
    
        'ip-spoofing': {
            title: 'IP Spoofing',
            icon: 'fa-user-secret',
            definition: 'Attackers forge source IP addresses in packet headers to hide their identity, bypass access controls, or perform reflection attacks.',
            causes: [
                'Lack of ingress/egress filtering',
                'Missing anti-spoofing measures on routers',
                'Inadequate source IP validation',
                'Absence of reverse path forwarding checks',
                'Weak network perimeter security'
            ],
            steps: [
                'Implement Ingress Filtering: Configure access lists to block spoofed IPs',
                'Enable uRPF: Configure unicast reverse path forwarding',
                'Source IP Validation: Implement proper source IP checking',
                'Rate Limiting: Apply rate limits to prevent abuse',
                'Network Monitoring: Deploy tools to detect IP spoofing attempts'
            ],
            verification: [
                'Router(config-if)# ip verify unicast source reachable-via rx',
                'Router(config)# access-list 100 deny ip 10.0.0.0 0.255.255.255 any',
                'Router(config)# access-list 100 deny ip 172.16.0.0 0.15.255.255 any',
                'Router(config)# access-list 100 deny ip 192.168.0.0 0.0.255.255 any',
                'Router(config-if)# ip access-group 100 in',
                'Router> show ip interface brief',
                'PC> ping [target-ip] -S [spoofed-source-ip]'
            ],
            commands: [
                'Router(config-if)# ip verify unicast source reachable-via rx',
                'Router(config)# access-list 100 deny ip 10.0.0.0 0.255.255.255 any',
                'Router(config)# access-list 100 deny ip 172.16.0.0 0.15.255.255 any',
                'Router(config)# access-list 100 deny ip 192.168.0.0 0.0.255.255 any',
                'Router(config-if)# ip access-group 100 in',
                'Router> show ip interface brief',
                'PC> ping [target-ip] -S [spoofed-source-ip]'
            ],
            simulation: 'Configure access lists and uRPF, test normal traffic flow, then simulate IP spoofing attempts and observe blocking behavior.',
            simulation_pkt: '#',
            screenshots: []
        },
        
        'mac-address-spoofing': {
            title: 'MAC Address Spoofing',
            icon: 'fa-id-card',
            definition: 'Attackers change their device\'s MAC address to impersonate another device, bypassing MAC-based access controls and security measures.',
            causes: [
                'Reliance on MAC addresses for authentication',
                'Lack of proper port security configuration',
                'Missing 802.1X authentication',
                'Inadequate network access control',
                'Weak physical security allowing device replacement'
            ],
            steps: [
                'Enable Port Security: Configure strict port security on switch ports',
                'Implement 802.1X: Deploy certificate-based authentication',
                'MAC Address Management: Maintain database of authorized MAC addresses',
                'Monitor MAC Changes: Implement logging for MAC address changes',
                'Physical Security: Secure network equipment and connection points'
            ],
            verification: [
                'Switch(config-if)# switchport port-security',
                'Switch(config-if)# switchport port-security maximum 1',
                'Switch(config-if)# switchport port-security mac-address sticky',
                'Switch(config-if)# switchport port-security violation shutdown',
                'Switch> show port-security',
                'Switch> show port-security address',
                'PC> ipconfig /all (to view MAC address)'
            ],
            commands: [
                'Switch(config-if)# switchport port-security',
                'Switch(config-if)# switchport port-security maximum 1',
                'Switch(config-if)# switchport port-security mac-address sticky',
                'Switch(config-if)# switchport port-security violation shutdown',
                'Switch> show port-security',
                'Switch> show port-security address',
                'PC> ipconfig /all (to view MAC address)'
            ],
            simulation: 'Configure port security, test legitimate access, then simulate MAC spoofing attack and observe security violations.',
            simulation_pkt: '#',
            screenshots: []
        },

        'dns-spoofing': {
            title: 'DNS Spoofing (DNS Cache Poisoning)',
            icon: 'fa-skull-crossbones',
            definition: 'Attackers provide false DNS responses to redirect users to malicious websites or intercept communications through DNS manipulation.',
            causes: [
                'Lack of DNS security extensions (DNSSEC)',
                'Vulnerable DNS server configuration',
                'Missing DNS response validation',
                'Inadequate DNS server protection',
                'Weak DNS query randomization'
            ],
            steps: [
                'Implement DNSSEC: Deploy DNS Security Extensions',
                'Secure DNS Configuration: Harden DNS server settings',
                'DNS Filtering: Implement DNS request filtering',
                'Cache Protection: Secure DNS cache against poisoning',
                'Monitor DNS Traffic: Deploy DNS traffic analysis tools'
            ],
            verification: [
                'PC> nslookup www.example.com',
                'PC> nslookup www.example.com [dns-server-ip]',
                'PC> ping [dns-server-ip]',
                'PC> ipconfig /flushdns',
                'Router> show ip route',
                'DNS Server> show dns (if available)',
                'PC> ping www.example.com'
            ],
            commands: [
                'PC> nslookup www.example.com',
                'PC> nslookup www.example.com [dns-server-ip]',
                'PC> ping [dns-server-ip]',
                'PC> ipconfig /flushdns',
                'Router> show ip route',
                'DNS Server> show dns (if available)',
                'PC> ping www.example.com'
            ],
            simulation: 'Configure DNS server, test normal name resolution, then simulate DNS spoofing with rogue DNS responses.',
            simulation_pkt: '#',
            screenshots: []
        },

        'dhcp-spoofing': {
            title: 'DHCP Spoofing',
            icon: 'fa-virus',
            definition: 'Attackers deploy rogue DHCP servers to provide malicious network configuration, redirecting traffic through attacker-controlled systems.',
            causes: [
                'Lack of DHCP snooping configuration',
                'Missing DHCP server authentication',
                'Inadequate network access control',
                'Absence of authorized DHCP server list',
                'Weak physical network security'
            ],
            steps: [
                'Enable DHCP Snooping: Configure DHCP snooping on switches',
                'Trusted Ports: Designate trusted ports for legitimate DHCP servers',
                'Rate Limiting: Implement DHCP rate limiting',
                'Option 82: Enable DHCP relay information option',
                'Monitor DHCP Traffic: Deploy DHCP traffic monitoring'
            ],
            verification: [
                'Switch(config)# ip dhcp snooping',
                'Switch(config)# ip dhcp snooping vlan 1',
                'Switch(config-if)# ip dhcp snooping trust',
                'Switch(config)# ip dhcp snooping rate limit 10',
                'Switch> show ip dhcp snooping',
                'Switch> show ip dhcp snooping binding',
                'PC> ipconfig /all',
                'PC> ipconfig /release',
                'PC> ipconfig /renew'
            ],
            commands: [
                'Switch(config)# ip dhcp snooping',
                'Switch(config)# ip dhcp snooping vlan 1',
                'Switch(config-if)# ip dhcp snooping trust',
                'Switch(config)# ip dhcp snooping rate limit 10',
                'Switch> show ip dhcp snooping',
                'Switch> show ip dhcp snooping binding',
                'PC> ipconfig /all',
                'PC> ipconfig /release',
                'PC> ipconfig /renew'
            ],
            simulation: 'Configure DHCP snooping, test legitimate DHCP operation, then simulate rogue DHCP server attack.',
            simulation_pkt: '#',
            screenshots: []
        },

        'ddos-attack': {
            title: 'Distributed Denial of Service (DDoS) Attack',
            icon: 'fa-bomb',
            definition: 'Multiple compromised systems simultaneously attack a target, overwhelming its resources and making services unavailable to legitimate users.',
            causes: [
                'Lack of traffic rate limiting',
                'Insufficient bandwidth capacity',
                'Missing DDoS protection mechanisms',
                'Inadequate network monitoring',
                'Weak incident response procedures'
            ],
            steps: [
                'Traffic Rate Limiting: Implement rate limiting on network devices',
                'Load Balancing: Deploy load balancers to distribute traffic',
                'Traffic Filtering: Configure access lists to block malicious traffic',
                'Bandwidth Management: Implement QoS and traffic shaping',
                'DDoS Protection Services: Deploy specialized DDoS mitigation tools'
            ],
            verification: [
                'Router(config-if)# rate-limit input 1000000 8000 8000 conform-action transmit exceed-action drop',
                'Router(config)# access-list 100 deny tcp any host [server-ip] eq 80 syn',
                'Router(config-if)# ip access-group 100 in',
                'Router> show interfaces',
                'Router> show access-lists',
                'Server> netstat -an',
                'PC> ping [server-ip] -l 65500 -t'
            ],
            commands: [
                'Router(config-if)# rate-limit input 1000000 8000 8000 conform-action transmit exceed-action drop',
                'Router(config)# access-list 100 deny tcp any host [server-ip] eq 80 syn',
                'Router(config-if)# ip access-group 100 in',
                'Router> show interfaces',
                'Router> show access-lists',
                'Server> netstat -an',
                'PC> ping [server-ip] -l 65500 -t'
            ],
            simulation: 'Configure multiple PCs to generate traffic simultaneously, monitor server response and implement mitigation techniques.',
            simulation_pkt: '#',
            screenshots: []
        },

        'network-intrusion-detection': {
            title: 'Network Intrusion Detection (IDS/IPS)',
            icon: 'fa-shield-virus',
            definition: 'Malicious activities and security policy violations go undetected, allowing attackers to compromise network resources and data.',
            causes: [
                'Missing intrusion detection systems',
                'Inadequate security monitoring',
                'Lack of signature updates',
                'Insufficient log analysis',
                'Poor incident response procedures'
            ],
            steps: [
                'Deploy IDS/IPS: Install intrusion detection/prevention systems',
                'Configure Signatures: Update and configure attack signatures',
                'Network Monitoring: Implement comprehensive network monitoring',
                'Log Analysis: Deploy log analysis and correlation tools',
                'Incident Response: Establish incident response procedures'
            ],
            verification: [
                'Router(config)# ip inspect name IDS tcp',
                'Router(config)# ip inspect name IDS udp',
                'Router(config-if)# ip inspect IDS in',
                'Router> show ip inspect sessions',
                'Router> show ip inspect statistics',
                'PC> nmap -sS [target-ip] (simulated port scan)',
                'IDS> show alerts (if available)'
            ],
            commands: [
                'Router(config)# ip inspect name IDS tcp',
                'Router(config)# ip inspect name IDS udp',
                'Router(config-if)# ip inspect IDS in',
                'Router> show ip inspect sessions',
                'Router> show ip inspect statistics',
                'PC> nmap -sS [target-ip] (simulated port scan)',
                'IDS> show alerts (if available)'
            ],
            simulation: 'Configure access lists to simulate IDS functionality, generate suspicious traffic, and monitor detection capabilities.',
            simulation_pkt: '#',
            screenshots: []
        },

        'bgp-route-hijacking': {
            title: 'BGP Route Hijacking',
            icon: 'fa-route',
            definition: 'Attackers announce false BGP routes to redirect traffic through their infrastructure, enabling traffic interception and manipulation.',
            causes: [
                'Lack of BGP route filtering',
                'Missing route origin validation',
                'Inadequate BGP security measures',
                'Weak peering relationships',
                'Absence of BGP monitoring'
            ],
            steps: [
                'Route Filtering: Implement prefix filters for BGP announcements',
                'Route Origin Validation: Deploy ROV mechanisms',
                'BGP Monitoring: Implement BGP route monitoring',
                'Peering Security: Establish secure peering relationships',
                'RPKI: Implement Resource Public Key Infrastructure'
            ],
            verification: [
                'Router(config-router)# neighbor [peer-ip] prefix-list FILTER-IN in',
                'Router(config)# ip prefix-list FILTER-IN permit 10.0.0.0/8 le 24',
                'Router> show ip bgp summary',
                'Router> show ip bgp neighbors',
                'Router> show ip route bgp',
                'Router(config-router)# bgp log-neighbor-changes'
            ],
            commands: [
                'Router(config-router)# neighbor [peer-ip] prefix-list FILTER-IN in',
                'Router(config)# ip prefix-list FILTER-IN permit 10.0.0.0/8 le 24',
                'Router> show ip bgp summary',
                'Router> show ip bgp neighbors',
                'Router> show ip route bgp',
                'Router(config-router)# bgp log-neighbor-changes'
            ],
            simulation: 'Configure BGP routing, test normal route propagation, then simulate route hijacking attack.',
            simulation_pkt: '#',
            screenshots: []
        },

    }

};

// Generate problem content HTML
function generateProblemContent(data) {
    // Create HTML for causes list with icons
    const causesList = data.causes
        .map(
            (cause) =>
                `<li style="padding-left: 0.3rem;"><i class="fas fa-leaf" style="color: var(--sepia-medium); margin-right: 8px;"></i>${cause}</li>`
        )
        .join("");

    // Remove list-style since we're using custom icons
    const causesListStyle = "list-style: none;";

    // Create HTML for steps list with command formatting
    const stepsList = data.steps
        .map((step) => {
            // Regex to find commands within backticks
            const commandRegex = /`([^`]+)`/g;
            const formattedStep = step.replace(
                commandRegex,
                '<code class="inline-code">$1</code>'
            );
            return `<div class="step">${formattedStep}</div>`;
        })
        .join("");

    // Create HTML for verification list if available
    let verificationHTML = "";
    if (data.verification && data.verification.length > 0) {
        const verificationList = data.verification
            .map(
                (item) =>
                    `<li style="padding-left: 0.3rem;"><i class="fas fa-check-square" style="color: var(--sepia-medium); margin-right: 8px;"></i>${item}</li>`
            )
            .join("");
            
        verificationHTML = `
            <div class="problem-card">
                <h3><i class="fas fa-pencil-square"></i> Verification</h3>
                <ul style="list-style: none;">
                    ${verificationList}
                </ul>
            </div>
        `;
    }

    // Create HTML for commands
    const commandsHTML = data.commands
        .map((cmd) => `<span class="command">${cmd}</span>`)
        .join("");

    // Create HTML for screenshots slideshow if available
    let screenshotsHTML = "";
    if (data.screenshots && data.screenshots.length > 0) {
        screenshotsHTML = `
            <div class="slideshow-wrapper">
                <h3><i class="fas fa-images"></i> Visual Guide</h3>
                <div class="slideshow-container" id="slideshowContainer">
                    <a class="prev" onclick="plusSlides(-1)">&#10094;</a>
                    <a class="next" onclick="plusSlides(1)">&#10095;</a>
                </div>
                <div class="dots-container" id="dotsContainer"></div>
            </div>
        `;
    }

    // Construct the full HTML content
    return `
        <div class="content-section fade-in">
            <h2><i class="fas ${data.icon}"></i> ${data.title}</h2>
            
            <div class="problem-card">
                <h3><i class="fas fa-info-circle"></i> Problem Definition</h3>
                <p>${data.definition}</p>
            </div>
            
            <div class="problem-card">
                <h3><i class="fas fa-search"></i> Potential Causes</h3>
                <ul style="${causesListStyle}">
                    ${causesList}
                </ul>
            </div>
            
            <div class="problem-card">
                <h3><i class="fas fa-tools"></i> Solution Steps</h3>
                <div class="solution-steps">
                    ${stepsList}
                </div>
            </div>

                ${verificationHTML}

            <div class="problem-card">
                ${screenshotsHTML}
            </div>
            
            <div class="problem-card">
                <h3><i class="fas fa-terminal"></i> Terminal Commands</h3>
                <div class="terminal">
                    <div class="terminal-header">
                        <span class="terminal-button red"></span>
                        <span class="terminal-button yellow"></span>
                        <span class="terminal-button green"></span>
                    </div>
                    <div class="terminal-content">
                        ${commandsHTML}
                    </div>
                </div>
            </div>
            
            <div class="problem-card">
                <h3><i class="fas fa-download"></i> Packet Tracer Simulation</h3>
                <div class="simulation-note">
                    <i class="fas fa-flask"></i>
                    <span><strong>Simulation Note:</strong> ${data.simulation}</span>
                    <p style="font-size: 0.85em; margin-top: 0.5rem; color: var(--sepia-medium);"><em>Download the Packet Tracer file to practice this scenario.</em></p>
                    <a href="${data.simulation_pkt}" class="download-button"><i class="fas fa-download"></i> Download Packet Tracer </a>
                </div>
            </div>
        </div>
    `;
}

// Generate "not found" content
function generateNotFoundContent(contentId) {
    return `
        <div class="content-section fade-in">
            <h2><i class="fas fa-exclamation-circle"></i> Content Not Found</h2>
            <div class="problem-card">
                <h3><i class="fas fa-search"></i> Requested Content Unavailable</h3>
                <p>The content you requested (ID: ${contentId}) is not available or is still under development.</p>
                <p>Please select another topic from the sidebar or check back later.</p>
            </div>
        </div>
    `;
}

// Initialize tabs in loaded content
function initializeTabs(container) {
    const tabContainers = container.querySelectorAll(".tab-container");

    tabContainers.forEach((tabContainer) => {
        const buttons = tabContainer.querySelectorAll(".tab-button");
        const contents = tabContainer.querySelectorAll(".tab-content");

        buttons.forEach((button, index) => {
            button.addEventListener("click", () => {
                // Remove active class from all buttons and contents
                buttons.forEach((btn) => btn.classList.remove("active"));
                contents.forEach((content) => content.classList.remove("active"));

                // Add active class to current button and content
                button.classList.add("active");
                contents[index].classList.add("active");
            });
        });

        // Activate first tab by default
        if (buttons.length > 0) {
            buttons[0].click();
        }
    });
}

// Apply scroll-based animations to newly loaded content
function observeNewContent(container) {
    // This is a placeholder for potential scroll-based animations
    // Could be implemented with Intersection Observer API
}

// Slideshow functionality
let slideIndex = 1;
let currentModalIndex = 1;
let currentScreenshots = [];

function addSlides(screenshots) {
    const slideshowContainer = document.getElementById("slideshowContainer");
    const dotsContainer = document.getElementById("dotsContainer");

    // Store screenshots for modal navigation
    currentScreenshots = screenshots;

    // Clear existing slides and dots (except navigation buttons)
    const prevButton = slideshowContainer.querySelector(".prev");
    const nextButton = slideshowContainer.querySelector(".next");
    slideshowContainer.innerHTML = "";
    if (prevButton) slideshowContainer.appendChild(prevButton);
    if (nextButton) slideshowContainer.appendChild(nextButton);
    dotsContainer.innerHTML = "";

    // Add new slides
    screenshots.forEach((screenshot, index) => {
        const slideDiv = document.createElement("div");
        slideDiv.className = "mySlides fade";
        slideDiv.innerHTML = `
            <div class="numbertext">${index + 1} / ${screenshots.length}</div>
            <img src="${screenshot.src}" class="slide-image" alt="${screenshot.caption}" onclick="openModal(\'${screenshot.src}\', \'${screenshot.caption}\', ${index + 1})">
            <div class="text">${screenshot.caption}</div>
        `;
        slideshowContainer.appendChild(slideDiv);

        // Add dot
        const dot = document.createElement("span");
        dot.className = "dot";
        dot.onclick = function () {
            currentSlide(index + 1);
        };
        dotsContainer.appendChild(dot);
    });

    // Show first slide
    showSlides(slideIndex);
}

function plusSlides(n) {
    showSlides((slideIndex += n));
}

function currentSlide(n) {
    showSlides((slideIndex = n));
}

function showSlides(n) {
    let i;
    const slides = document.getElementsByClassName("mySlides");
    const dots = document.getElementsByClassName("dot");

    if (!slides.length) return;

    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        slides[i].classList.remove("active");
    }

    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active-dot", "");
    }

    slides[slideIndex - 1].style.display = "block";
    slides[slideIndex - 1].classList.add("active");
    dots[slideIndex - 1].className += " active-dot";
}

// Modal functionality for enlarged image view
function openModal(src, caption, index) {
    let modal = document.getElementById("imageModal");
    let modalImg = document.getElementById("modalImage");
    let captionText = document.getElementById("caption");

    // Set current modal index for navigation
    currentModalIndex = index || 1;

    if (!modal) {
        // Create modal if it doesn't exist
        const modalDiv = document.createElement("div");
        modalDiv.id = "imageModal";
        modalDiv.className = "modal";
        modalDiv.innerHTML = `
            <span class="close" onclick="closeModal()">&times;</span>
            <a class="modal-prev" onclick="plusModalSlides(-1)">&#10094;</a>
            <a class="modal-next" onclick="plusModalSlides(1)">&#10095;</a>
            <img class="modal-content" id="modalImage">
            <div id="caption" class="modal-caption"></div>
        `;
        document.body.appendChild(modalDiv);

        // Get the newly created elements
        modal = document.getElementById("imageModal");
        modalImg = document.getElementById("modalImage");
        captionText = document.getElementById("caption");
    }

    modal.style.display = "block";
    modalImg.src = src;
    captionText.innerHTML = caption;
}

function closeModal() {
    const modal = document.getElementById("imageModal");
    if (modal) {
        modal.style.display = "none";
    }
}

// Navigate between images in modal
function plusModalSlides(n) {
    showModalSlides((currentModalIndex += n));
}

function showModalSlides(n) {
    if (!currentScreenshots || currentScreenshots.length === 0) return;

    if (n > currentScreenshots.length) {
        currentModalIndex = 1;
    }
    if (n < 1) {
        currentModalIndex = currentScreenshots.length;
    }
    const modalImg = document.getElementById("modalImage");
    const captionText = document.getElementById("caption");
    const currentScreenshot = currentScreenshots[currentModalIndex - 1];

    modalImg.src = currentScreenshot.src;
    captionText.innerHTML = currentScreenshot.caption;
}

// Close modal when clicking outside the image
window.onclick = function (event) {
    const modal = document.getElementById("imageModal");
    if (event.target == modal) {
        closeModal();
    }
};










