import { useState, useEffect } from 'preact/hooks';

type Strain = {
  id: number;
  name: string;
  race: string; // indica, sativa, or hybrid
  effects: {
    positive: string[];
    negative: string[];
    medical: string[];
  };
  flavors: string[];
  description?: string;
};

export default function PuffFinderApp() {
  const [strains, setStrains] = useState<Strain[]>([]);
  const [filteredStrains, setFilteredStrains] = useState<Strain[]>([]);
  const [selectedStrain, setSelectedStrain] = useState<Strain | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    const fetchStrains = async () => {
      setLoading(true);
      try {
        // Using a mock dataset for demo purposes
        // In a real app, you'd fetch from an API like:
        // const response = await fetch('https://cannabis-api.example.com/strains');
        // const data = await response.json();

        // Sample data to demonstrate functionality
        const mockData: Strain[] = [
          {
            id: 1,
            name: 'OG Kush',
            race: 'hybrid',
            effects: {
              positive: ['Relaxed', 'Happy', 'Euphoric'],
              negative: ['Dry Mouth', 'Dry Eyes'],
              medical: ['Stress', 'Pain', 'Depression']
            },
            flavors: ['Earthy', 'Pine', 'Citrus'],
            description: 'OG Kush is a legendary strain with a name that has recognition even outside of the cannabis world. Despite its fame, though, its genetic origins remain a mystery.'
          },
          {
            id: 2,
            name: 'Blue Dream',
            race: 'hybrid',
            effects: {
              positive: ['Relaxed', 'Euphoric', 'Creative'],
              negative: ['Dry Mouth', 'Dizziness'],
              medical: ['Depression', 'Insomnia', 'Pain']
            },
            flavors: ['Berry', 'Sweet', 'Blueberry'],
            description: 'Blue Dream is a sativa-dominant hybrid that balances full-body relaxation with gentle cerebral invigoration.'
          },
          {
            id: 3,
            name: 'Northern Lights',
            race: 'indica',
            effects: {
              positive: ['Relaxed', 'Sleepy', 'Happy'],
              negative: ['Dry Mouth', 'Dizziness'],
              medical: ['Insomnia', 'Pain', 'Stress']
            },
            flavors: ['Sweet', 'Spicy', 'Earthy'],
            description: 'Northern Lights stands among the most famous strains of all time, a pure indica cherished for its resinous buds and resilient genetics.'
          },
          {
            id: 4,
            name: 'Jack Herer',
            race: 'sativa',
            effects: {
              positive: ['Happy', 'Uplifted', 'Creative'],
              negative: ['Dry Mouth', 'Paranoia'],
              medical: ['Stress', 'Depression', 'Fatigue']
            },
            flavors: ['Earthy', 'Pine', 'Woody'],
            description: 'Jack Herer is a sativa-dominant cannabis strain that has gained as much renown as its namesake, the marijuana activist and author.'
          },
          {
            id: 5,
            name: 'Granddaddy Purple',
            race: 'indica',
            effects: {
              positive: ['Relaxed', 'Sleepy', 'Happy'],
              negative: ['Dry Mouth', 'Dry Eyes'],
              medical: ['Insomnia', 'Pain', 'Stress']
            },
            flavors: ['Grape', 'Berry', 'Sweet'],
            description: 'Granddaddy Purple (GDP) is a famous indica cross between Purple Urkle and Big Bud.'
          },
          {
            id: 6,
            name: 'Sour Diesel',
            race: 'sativa',
            effects: {
              positive: ['Energetic', 'Happy', 'Uplifted'],
              negative: ['Dry Mouth', 'Paranoid'],
              medical: ['Stress', 'Depression', 'Pain']
            },
            flavors: ['Diesel', 'Pungent', 'Earthy'],
            description: 'Sour Diesel is an invigorating sativa named after its pungent, diesel-like aroma.'
          },
          {
            id: 7,
            name: 'Girl Scout Cookies',
            race: 'hybrid',
            effects: {
              positive: ['Happy', 'Euphoric', 'Relaxed'],
              negative: ['Dry Mouth', 'Paranoid'],
              medical: ['Stress', 'Depression', 'Pain']
            },
            flavors: ['Sweet', 'Earthy', 'Dessert'],
            description: 'GSC, formerly known as Girl Scout Cookies, is a famous hybrid strain that originated in California.'
          },
          {
            id: 8,
            name: 'Green Crack',
            race: 'sativa',
            effects: {
              positive: ['Energetic', 'Focused', 'Happy'],
              negative: ['Paranoid', 'Anxious'],
              medical: ['Fatigue', 'Stress', 'Depression']
            },
            flavors: ['Citrus', 'Earthy', 'Sweet'],
            description: 'Green Crack, also known as "Green Crush" or "Mango Crack," is a potent sativa strain named after its strong energetic effects.'
          }
        ];

        setStrains(mockData);
        setFilteredStrains(mockData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch strain data. Please try again later.');
        setLoading(false);
      }
    };

    fetchStrains();
  }, []);

  useEffect(() => {
    // Filter strains based on search query and type filter
    const results = strains.filter(strain => {
      const matchesSearch = strain.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || strain.race === typeFilter;
      return matchesSearch && matchesType;
    });

    setFilteredStrains(results);
  }, [searchQuery, typeFilter, strains]);

  const handleSelectStrain = (strain: Strain) => {
    setSelectedStrain(strain);
  };

  const handleCloseModal = () => {
    setSelectedStrain(null);
  };

  // Get a color based on strain type
  const getStrainTypeColor = (race: string) => {
    switch (race) {
      case 'indica':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'sativa':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'hybrid':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="puff-finder w-full max-w-6xl mx-auto">
      {/* Search and Filter Section */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3">
          <input
            type="text"
            placeholder="Search strains..."
            value={searchQuery}
            onChange={(e) => setSearchQuery((e.target as HTMLSelectElement).value)}
            className="w-full p-3 rounded-lg border border-light-border bg-light-card dark:bg-dark-card dark:border-dark-border text-light-text dark:text-white focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
          />
        </div>
        <div className="w-full md:w-1/3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter((e.target as HTMLSelectElement).value)}
            className="w-full p-3 rounded-lg border border-light-border bg-light-card dark:bg-dark-card dark:border-dark-border text-light-text dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="indica">Indica</option>
            <option value="sativa">Sativa</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-light-primary dark:text-dark-primary align-[-0.125em]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-2 text-light-text-heading dark:text-white">Loading strains...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Results Grid */}
      {!loading && !error && (
        <>
          <p className="mb-4 text-light-text-muted dark:text-dark-text-muted">
            Found {filteredStrains.length} strain{filteredStrains.length !== 1 ? 's' : ''}
          </p>

          {filteredStrains.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStrains.map(strain => (
                <div
                  key={strain.id}
                  className="bg-light-card dark:bg-dark-card p-4 rounded-lg border border-light-border dark:border-dark-border hover:shadow-lg hover:border-light-primary dark:hover:border-dark-primary transition-all duration-200 cursor-pointer"
                  onClick={() => handleSelectStrain(strain)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-light-text-heading dark:text-white">{strain.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStrainTypeColor(strain.race)} shadow-sm`}>
                      {strain.race.charAt(0).toUpperCase() + strain.race.slice(1)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {strain.effects.positive.slice(0, 3).map((effect, index) => (
                      <span
                        key={index}
                        className="bg-light-background-alt dark:bg-dark-background-alt px-2 py-1 rounded-full text-xs hover:bg-light-background dark:hover:bg-dark-background transition-colors duration-200"
                      >
                        {effect}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 text-light-text-muted dark:text-dark-text-muted text-sm">
                    {strain.flavors.slice(0, 3).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-light-background-alt dark:bg-dark-background-alt rounded-lg">
              <p className="text-light-text-muted dark:text-dark-text-muted">No strains found matching your criteria.</p>
            </div>
          )}
        </>
      )}

      {/* Strain Detail Modal */}
      {selectedStrain && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-light-card dark:bg-dark-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideIn">
            <div className="sticky top-0 bg-light-card dark:bg-dark-card p-4 border-b border-light-border dark:border-dark-border flex justify-between items-center">
              <h2 className="text-xl font-bold text-light-text-heading dark:text-white">{selectedStrain.name}</h2>
              <button
                onClick={handleCloseModal}
                className="text-light-text-muted dark:text-dark-text-muted hover:text-light-text dark:hover:text-white p-1.5 rounded-full hover:bg-light-background-alt dark:hover:bg-dark-background-alt transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStrainTypeColor(selectedStrain.race)}`}>
                  {selectedStrain.race.charAt(0).toUpperCase() + selectedStrain.race.slice(1)}
                </span>
              </div>

              <p className="text-light-text dark:text-dark-text-body mb-6">
                {selectedStrain.description || "No description available for this strain."}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium text-light-text-heading dark:text-white mb-2">Positive Effects</h3>
                  <ul className="space-y-1">
                    {selectedStrain.effects.positive.map((effect, index) => (
                      <li key={index} className="flex items-center">
                        <span className="mr-2 text-green-500">•</span>
                        <span className="text-sm text-light-text dark:text-dark-text-body">{effect}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-light-text-heading dark:text-white mb-2">Potential Negatives</h3>
                  <ul className="space-y-1">
                    {selectedStrain.effects.negative.map((effect, index) => (
                      <li key={index} className="flex items-center">
                        <span className="mr-2 text-red-500">•</span>
                        <span className="text-sm text-light-text dark:text-dark-text-body">{effect}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-light-text-heading dark:text-white mb-2">Medical Uses</h3>
                  <ul className="space-y-1">
                    {selectedStrain.effects.medical.map((effect, index) => (
                      <li key={index} className="flex items-center">
                        <span className="mr-2 text-blue-500">•</span>
                        <span className="text-sm text-light-text dark:text-dark-text-body">{effect}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium text-light-text-heading dark:text-white mb-2">Flavors</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedStrain.flavors.map((flavor, index) => (
                    <span
                      key={index}
                      className="bg-light-background-alt dark:bg-dark-background-alt px-3 py-1 rounded-full text-sm"
                    >
                      {flavor}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-light-card dark:bg-dark-card p-4 border-t border-light-border dark:border-dark-border">
              <div className="my-6 flex w-full justify-end">
                <button
                  onClick={handleCloseModal}
                  className="btn w-full justify-center lg:w-auto"
                >
                  <span className="rounded-full px-12 py-3 text-center text-sm text-light-text-heading dark:text-white">
                    Close
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
