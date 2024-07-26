export default async function fetchCities() {
    const resource_id = 'd4901968-dad3-4845-a9b0-a57d027f11ab';
    const HEBREW_NAME_KEY = 'שם_ישוב';
    const ENGLISH_NAME_KEY = 'שם_ישוב_לועזי';

    const apiUrl = `https://data.gov.il/api/3/action/datastore_search?resource_id=${resource_id}`;
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const cityRecords = data.result.records.map(record => ({
        id: record._id,
        hebrewName: record[HEBREW_NAME_KEY],
        englishName: record[ENGLISH_NAME_KEY]
      }));

      const sortedCityRecords = cityRecords.sort((a,b) => a.englishName.localeCompare(b.englishName)).filter(city => city.englishName.trim())
      return sortedCityRecords;
      
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
  