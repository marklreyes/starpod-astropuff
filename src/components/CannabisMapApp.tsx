import { useState, useEffect, useRef } from 'preact/hooks';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

type LegalityStatus = 'legal' | 'mixed' | 'illegal';

interface StateData {
  name: string;
  abbreviation: string;
  status: LegalityStatus;
  description: string;
}

export default function CannabisMapApp() {
  const [hoveredState, setHoveredState] = useState<StateData | null>(null);
  const [legendVisible, setLegendVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<any>(null);
  const projectionRef = useRef<any>(null);
  const pathRef = useRef<any>(null);
  const isLoadingRef = useRef(true);

  // Cannabis legality data by state (as of May 2025)
const statesData: { [key: string]: StateData } = {
	AL: { name: 'Alabama', abbreviation: 'AL', status: 'mixed', description: 'Medical cannabis is legal but has strict limitations.' },
	AK: { name: 'Alaska', abbreviation: 'AK', status: 'legal', description: 'Cannabis is legal for recreational and medical use.' },
	AZ: { name: 'Arizona', abbreviation: 'AZ', status: 'legal', description: 'Cannabis is legal for recreational and medical use.' },
	AR: { name: 'Arkansas', abbreviation: 'AR', status: 'mixed', description: 'Medical cannabis is legal with a physician recommendation.' },
	CA: { name: 'California', abbreviation: 'CA', status: 'legal', description: 'Cannabis is legal for recreational and medical use.' },
	CO: { name: 'Colorado', abbreviation: 'CO', status: 'legal', description: 'First state to legalize recreational cannabis in 2012.' },
	CT: { name: 'Connecticut', abbreviation: 'CT', status: 'legal', description: 'Cannabis is legal for recreational and medical use.' },
	DE: { name: 'Delaware', abbreviation: 'DE', status: 'legal', description: 'Cannabis is legal for recreational and medical use.' },
	FL: { name: 'Florida', abbreviation: 'FL', status: 'mixed', description: 'Medical cannabis is legal but recreational use remains illegal.' },
	GA: { name: 'Georgia', abbreviation: 'GA', status: 'mixed', description: 'Limited medical cannabis oil is legal for specific conditions.' },
	HI: { name: 'Hawaii', abbreviation: 'HI', status: 'mixed', description: 'Medical cannabis is legal but recreational use remains illegal.' },
	ID: { name: 'Idaho', abbreviation: 'ID', status: 'illegal', description: 'Cannabis is illegal for both medical and recreational use.' },
	IL: { name: 'Illinois', abbreviation: 'IL', status: 'legal', description: 'Cannabis is legal for recreational and medical use.' },
	IN: { name: 'Indiana', abbreviation: 'IN', status: 'mixed', description: 'Cannabis is illegal with limited exceptions for CBD oil.' },
	IA: { name: 'Iowa', abbreviation: 'IA', status: 'mixed', description: 'Limited medical cannabis program available.' },
	KS: { name: 'Kansas', abbreviation: 'KS', status: 'illegal', description: 'Cannabis is illegal for both medical and recreational use.' },
	KY: { name: 'Kentucky', abbreviation: 'KY', status: 'mixed', description: 'Recent medical cannabis law with limited access.' },
	LA: { name: 'Louisiana', abbreviation: 'LA', status: 'mixed', description: 'Medical cannabis is legal but recreational use remains illegal.' },
	ME: { name: 'Maine', abbreviation: 'ME', status: 'legal', description: 'Cannabis is legal for recreational and medical use.' },
	MD: { name: 'Maryland', abbreviation: 'MD', status: 'legal', description: 'Cannabis is legal for recreational and medical use.' },
	MA: { name: 'Massachusetts', abbreviation: 'MA', status: 'legal', description: 'Cannabis is legal for recreational and medical use.' },
	MI: { name: 'Michigan', abbreviation: 'MI', status: 'legal', description: 'Cannabis is legal for recreational and medical use.' },
	MN: { name: 'Minnesota', abbreviation: 'MN', status: 'legal', description: 'Cannabis is legal for recreational and medical use.' },
	MS: { name: 'Mississippi', abbreviation: 'MS', status: 'mixed', description: 'Medical cannabis is legal but recreational use remains illegal.' },
	MO: { name: 'Missouri', abbreviation: 'MO', status: 'legal', description: 'Cannabis is legal for recreational and medical use.' },
	MT: { name: 'Montana', abbreviation: 'MT', status: 'legal', description: 'Cannabis is legal for recreational and medical use.' },
	NE: { name: 'Nebraska', abbreviation: 'NE', status: 'mixed', description: 'Possession is decriminalized but remains illegal. No medical program.' },
	NV: { name: 'Nevada', abbreviation: 'NV', status: 'legal', description: 'Cannabis is legal for recreational and medical use.' },
	NH: { name: 'New Hampshire', abbreviation: 'NH', status: 'mixed', description: 'Medical cannabis is legal but recreational use remains illegal.' },
	NJ: { name: 'New Jersey', abbreviation: 'NJ', status: 'legal', description: 'Cannabis is legal for recreational and medical use.' },
	NM: { name: 'New Mexico', abbreviation: 'NM', status: 'legal', description: 'Cannabis is legal for recreational and medical use.' },
	NY: { name: 'New York', abbreviation: 'NY', status: 'legal', description: 'Cannabis is legal for recreational and medical use.' },
	NC: { name: 'North Carolina', abbreviation: 'NC', status: 'mixed', description: 'Possession is decriminalized but cannabis remains largely illegal.' },
	ND: { name: 'North Dakota', abbreviation: 'ND', status: 'mixed', description: 'Medical cannabis is legal but recreational use remains illegal.' },
	OH: { name: 'Ohio', abbreviation: 'OH', status: 'legal', description: 'Cannabis is legal for recreational and medical use.' },
	OK: { name: 'Oklahoma', abbreviation: 'OK', status: 'mixed', description: 'Medical cannabis is legal but recreational use remains illegal.' },
	OR: { name: 'Oregon', abbreviation: 'OR', status: 'legal', description: 'Cannabis is legal for recreational and medical use.' },
	PA: { name: 'Pennsylvania', abbreviation: 'PA', status: 'mixed', description: 'Medical cannabis is legal but recreational use remains illegal.' },
	RI: { name: 'Rhode Island', abbreviation: 'RI', status: 'legal', description: 'Cannabis is legal for recreational and medical use.' },
	SC: { name: 'South Carolina', abbreviation: 'SC', status: 'illegal', description: 'Cannabis is illegal with very limited CBD exceptions.' },
	SD: { name: 'South Dakota', abbreviation: 'SD', status: 'mixed', description: 'Medical cannabis is legal but recreational use remains illegal.' },
	TN: { name: 'Tennessee', abbreviation: 'TN', status: 'mixed', description: 'Cannabis is illegal with very limited CBD exceptions.' },
	TX: { name: 'Texas', abbreviation: 'TX', status: 'mixed', description: 'Limited medical cannabis program for specific conditions.' },
	UT: { name: 'Utah', abbreviation: 'UT', status: 'mixed', description: 'Medical cannabis is legal but recreational use remains illegal.' },
	VT: { name: 'Vermont', abbreviation: 'VT', status: 'legal', description: 'Cannabis is legal for recreational and medical use.' },
	VA: { name: 'Virginia', abbreviation: 'VA', status: 'legal', description: 'Cannabis is legal for recreational and medical use.' },
	WA: { name: 'Washington', abbreviation: 'WA', status: 'legal', description: 'Cannabis is legal for recreational and medical use.' },
	WV: { name: 'West Virginia', abbreviation: 'WV', status: 'mixed', description: 'Medical cannabis is legal but recreational use remains illegal.' },
	WI: { name: 'Wisconsin', abbreviation: 'WI', status: 'mixed', description: 'Cannabis is illegal with very limited CBD exceptions.' },
	WY: { name: 'Wyoming', abbreviation: 'WY', status: 'illegal', description: 'Cannabis is illegal with very limited CBD exceptions.' },
	DC: { name: 'District of Columbia', abbreviation: 'DC', status: 'legal', description: 'Cannabis is legal for recreational and medical use.' }
};

// Color scale for different cannabis statuses
const getStatusColor = (status: LegalityStatus) => {
	switch (status) {
		case 'legal': return '#10b981'; // green-500
		case 'mixed': return '#eab308'; // yellow-500
		case 'illegal': return '#ef4444'; // red-500
		default: return '#9ca3af'; // gray-400
	}
};

const getStatusLabel = (status: LegalityStatus) => {
	switch (status) {
		case 'legal': return 'Fully Legal';
		case 'mixed': return 'Mixed Status';
		case 'illegal': return 'Illegal';
		default: return 'Unknown';
	}
};

  // Safely initialize D3 visualization
  const initViz = () => {
    if (!mapRef.current || !tooltipRef.current || !isLoadingRef.current) return;

    try {
      // Clear any existing content
      d3.select(mapRef.current).selectAll('*').remove();

      // Set up dimensions
      const width = mapRef.current.clientWidth;
      const height = 500;

      // Create SVG
      svgRef.current = d3.select(mapRef.current)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('style', 'max-width: 100%; height: auto;');

      // Create a group for the map
      const g = svgRef.current.append('g');

      // Tooltip div (positioned absolutely)
      d3.select(tooltipRef.current)
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('background-color', 'var(--color-light-card, white)')
        .style('border', '1px solid var(--color-light-border, #e5e7eb)')
        .style('border-radius', '0.375rem')
        .style('padding', '0.75rem')
        .style('z-index', '50')
        .style('box-shadow', '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)');

      // Define the projection for the US map (excluding Alaska and Hawaii)
      projectionRef.current = d3.geoAlbersUsa()
        .scale(width)
        .translate([width / 2, height / 2]);

      // Create a path generator
      pathRef.current = d3.geoPath()
        .projection(projectionRef.current);

      return g;
    } catch (error) {
      console.error("Error initializing visualization:", error);
      setHasError(true);
      return null;
    }
  };

  // Load and render map data
  const loadMapData = async (g: any) => {
    if (!g || !isLoadingRef.current) return;

    try {
      // Fetch map data with error handling
      const usPromise = fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.json();
        });

      // Instead of fetching the TSV, use a hardcoded state mapping
      // This eliminates the 404 error from the missing TSV file
      const stateMapping = [
        { id: "01", code: "AL", name: "Alabama" },
        { id: "02", code: "AK", name: "Alaska" },
        { id: "04", code: "AZ", name: "Arizona" },
        { id: "05", code: "AR", name: "Arkansas" },
        { id: "06", code: "CA", name: "California" },
        { id: "08", code: "CO", name: "Colorado" },
        { id: "09", code: "CT", name: "Connecticut" },
        { id: "10", code: "DE", name: "Delaware" },
        { id: "11", code: "DC", name: "District of Columbia" },
        { id: "12", code: "FL", name: "Florida" },
        { id: "13", code: "GA", name: "Georgia" },
        { id: "15", code: "HI", name: "Hawaii" },
        { id: "16", code: "ID", name: "Idaho" },
        { id: "17", code: "IL", name: "Illinois" },
        { id: "18", code: "IN", name: "Indiana" },
        { id: "19", code: "IA", name: "Iowa" },
        { id: "20", code: "KS", name: "Kansas" },
        { id: "21", code: "KY", name: "Kentucky" },
        { id: "22", code: "LA", name: "Louisiana" },
        { id: "23", code: "ME", name: "Maine" },
        { id: "24", code: "MD", name: "Maryland" },
        { id: "25", code: "MA", name: "Massachusetts" },
        { id: "26", code: "MI", name: "Michigan" },
        { id: "27", code: "MN", name: "Minnesota" },
        { id: "28", code: "MS", name: "Mississippi" },
        { id: "29", code: "MO", name: "Missouri" },
        { id: "30", code: "MT", name: "Montana" },
        { id: "31", code: "NE", name: "Nebraska" },
        { id: "32", code: "NV", name: "Nevada" },
        { id: "33", code: "NH", name: "New Hampshire" },
        { id: "34", code: "NJ", name: "New Jersey" },
        { id: "35", code: "NM", name: "New Mexico" },
        { id: "36", code: "NY", name: "New York" },
        { id: "37", code: "NC", name: "North Carolina" },
        { id: "38", code: "ND", name: "North Dakota" },
        { id: "39", code: "OH", name: "Ohio" },
        { id: "40", code: "OK", name: "Oklahoma" },
        { id: "41", code: "OR", name: "Oregon" },
        { id: "42", code: "PA", name: "Pennsylvania" },
        { id: "44", code: "RI", name: "Rhode Island" },
        { id: "45", code: "SC", name: "South Carolina" },
        { id: "46", code: "SD", name: "South Dakota" },
        { id: "47", code: "TN", name: "Tennessee" },
        { id: "48", code: "TX", name: "Texas" },
        { id: "49", code: "UT", name: "Utah" },
        { id: "50", code: "VT", name: "Vermont" },
        { id: "51", code: "VA", name: "Virginia" },
        { id: "53", code: "WA", name: "Washington" },
        { id: "54", code: "WV", name: "West Virginia" },
        { id: "55", code: "WI", name: "Wisconsin" },
        { id: "56", code: "WY", name: "Wyoming" }
      ];

      // Use Promise.all for parallel fetching - only using the usPromise now
      const [us] = await Promise.all([usPromise]);

      if (!isLoadingRef.current) return; // Check if component is still mounted

      // Extract state features
      const states = (topojson.feature(us, us.objects.states) as unknown as GeoJSON.FeatureCollection).features;

      // Create a map from state id to state code using our hardcoded mapping
      const stateIdToCode = new Map(
        stateMapping.map(d => [d.id, d.code])
      );

      // Draw states
      g.selectAll('path')
        .data(states)
        .enter()
        .append('path')
        .attr('d', pathRef.current)
        .attr('fill', (d: any) => {
          const stateCode = stateIdToCode.get(d.id);
          return stateCode && statesData[stateCode]
            ? getStatusColor(statesData[stateCode].status)
            : '#9ca3af'; // gray-400 for states without data
        })
        .attr('stroke', 'var(--color-gray-700, #374151)')
        .attr('stroke-width', 0.5)
        .attr('class', 'state-path cursor-pointer transition-colors duration-200')
        .on('mouseover', function (event: any, d: any) {
          const stateCode = stateIdToCode.get(d.id);
          if (stateCode && statesData[stateCode]) {
            // Highlight the state
            d3.select(this)
              .attr('stroke-width', 1.5)
              .attr('stroke', 'var(--color-gray-900, #111827)');

            // Update the hovered state
            setHoveredState(statesData[stateCode]);
          }
        })
        .on('mouseout', function () {
          // Reset state styling
          d3.select(this)
            .attr('stroke-width', 0.5)
            .attr('stroke', 'var(--color-gray-700, #374151)');

          // Clear hovered state
          setHoveredState(null);
        });

      // Add state labels (optional) - only for larger states for better readability
      g.selectAll('text')
        .data(states)
        .enter()
        .append('text')
        .attr('transform', (d: any) => {
          const centroid = pathRef.current.centroid(d);
          return centroid ? `translate(${centroid[0]},${centroid[1]})` : '';
        })
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em')
        .attr('font-size', '8px')
        .attr('fill', (d: any) => {
        const stateCode = stateIdToCode.get(d.id);
        if (stateCode) {
          const status = statesData[stateCode]?.status;
          // Use white text for darker backgrounds
          if (status === 'legal' || status === 'illegal') {
            return 'white';
          }
        }
        return '#111827'; // Default dark text
        })
        .text((d: any) => {
          const stateCode = stateIdToCode.get(d.id);
          return stateCode || '';
        })
        .attr('pointer-events', 'none'); // prevent text from interfering with mouse events

      setIsLoading(false);
    } catch (error) {
      console.error("Error loading map data:", error);
      setHasError(true);
      setIsLoading(false);
    }
  };

  // Handle window resize
  const handleResize = () => {
    if (!mapRef.current || !svgRef.current || !projectionRef.current || !pathRef.current) return;

    const width = mapRef.current.clientWidth;
    const height = 500;

    svgRef.current
      .attr('width', width)
      .attr('viewBox', `0 0 ${width} ${height}`);

    // Update projection scale and translate
    projectionRef.current
      .scale(width)
      .translate([width / 2, height / 2]);

    // Update paths and labels
    svgRef.current.selectAll('path').attr('d', pathRef.current);
    svgRef.current.selectAll('text').attr('transform', (d: any) => {
      const centroid = pathRef.current.centroid(d);
      return centroid ? `translate(${centroid[0]},${centroid[1]})` : '';
    });
  };

  useEffect(() => {
    // Reset loading state on component mount
    isLoadingRef.current = true;
    setIsLoading(true);
    setHasError(false);

    // Initialize map with a slight delay to ensure DOM is ready
    const initTimeout = setTimeout(() => {
      const g = initViz();
      if (g) loadMapData(g);
    }, 100);

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      clearTimeout(initTimeout);
      isLoadingRef.current = false;
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="cannabis-map-container w-full max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-light-text-heading dark:text-white">US Cannabis Legality Map</h2>
  <p className="mb-6 text-light-text dark:text-dark-text-body">
    Hover over states to see cannabis legal status. Data updated as of {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.
  </p>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Map container */}
        <div className="relative flex-grow border rounded-lg p-4 bg-light-card dark:bg-dark-card border-light-border dark:border-dark-border">
          {/* Legend toggle button (mobile) */}
          <button
            className="lg:hidden absolute top-2 right-2 z-10 p-2 bg-light-background dark:bg-dark-background rounded-full"
            onClick={() => setLegendVisible(!legendVisible)}
            aria-label="Toggle legend"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Mobile legend */}
          {legendVisible && (
            <div className="lg:hidden absolute top-12 right-2 z-10 bg-light-card dark:bg-dark-card rounded-lg shadow-lg border border-light-border dark:border-dark-border p-3 mb-4">
              <div className="text-sm font-medium mb-2">Cannabis Status:</div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-2 rounded" style={{ backgroundColor: '#10b981' }}></div>
                  <span>Fully Legal</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-2 rounded" style={{ backgroundColor: '#eab308' }}></div>
                  <span>Mixed Status</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-2 rounded" style={{ backgroundColor: '#ef4444' }}></div>
                  <span>Illegal</span>
                </div>
              </div>
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-light-card dark:bg-dark-card bg-opacity-75 dark:bg-opacity-75 z-10">
              <div className="text-center">
                <svg className="animate-spin h-8 w-8 mx-auto text-primary-600 dark:text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-2 text-sm text-light-text-muted dark:text-dark-text-muted">Loading map data...</p>
              </div>
            </div>
          )}

          {/* Error message */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-light-card dark:bg-dark-card">
              <div className="text-center p-6 max-w-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="text-lg font-medium text-light-text-heading dark:text-white mb-2">Failed to Load Map</h3>
                <p className="text-sm text-light-text dark:text-dark-text-body">
                  There was an error loading the map data. Please try refreshing the page.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          )}

          {/* D3 Map will be rendered here */}
          <div ref={mapRef} className="w-full h-[500px]"></div>

          {/* Tooltip for D3 hover */}
          <div ref={tooltipRef} className="hidden"></div>

          {/* State info overlay */}
          {hoveredState && !isLoading && !hasError && (
            <div className="absolute bottom-4 left-4 right-4 bg-light-card dark:bg-dark-background border border-light-border dark:border-dark-border p-4 rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg">{hoveredState.name}</h3>
				<div className={`px-3 py-1 rounded-full text-xs font-medium ${
				  hoveredState.status === 'legal' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
				  hoveredState.status === 'mixed' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
				  hoveredState.status === 'illegal' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
				  'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
				}`}>
                  {getStatusLabel(hoveredState.status)}
                </div>
              </div>
              <p className="text-sm text-light-text-muted dark:text-dark-text-muted">{hoveredState.description}</p>
            </div>
          )}
        </div>

        {/* Desktop Legend */}
        <div className="hidden lg:block w-60 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg p-4 h-fit">
          <h3 className="font-medium mb-4 text-light-text-heading dark:text-white">Cannabis Legal Status</h3>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-4 h-4 mt-1 mr-3 rounded" style={{ backgroundColor: '#10b981' }}></div>
              <div>
                <p className="font-medium">Fully Legal</p>
                <p className="text-sm text-light-text-muted dark:text-dark-text-muted">Recreational and medical use legal</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-4 h-4 mt-1 mr-3 rounded" style={{ backgroundColor: '#eab308' }}></div>
              <div>
                <p className="font-medium">Mixed Status</p>
                <p className="text-sm text-light-text-muted dark:text-dark-text-muted">Limited medical use or decriminalization</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-4 h-4 mt-1 mr-3 rounded" style={{ backgroundColor: '#ef4444' }}></div>
              <div>
                <p className="font-medium">Illegal</p>
                <p className="text-sm text-light-text-muted dark:text-dark-text-muted">Prohibited for recreational and medical use</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-light-border dark:border-dark-border">
            <p className="text-xs text-light-text-muted dark:text-dark-text-muted">Note: Cannabis legality can change. This information is for educational purposes only.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-light-background-alt dark:bg-dark-background-alt rounded-lg p-4 text-sm text-light-text-muted dark:text-dark-text-muted">
        <p>Disclaimer: Laws regarding cannabis are subject to change. This map is for informational purposes only and should not be considered legal advice. Always consult local laws before making decisions regarding cannabis use or possession.</p>
      </div>
    </div>
  );
}
