exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('region').del()
    .then(() => knex('region')
      .insert([
        { id: 1, short_name: 'AB', country_id: 1, name: 'Alberta' },
        { id: 2, short_name: 'BC', country_id: 1, name: 'British Columbia' },
        { id: 3, short_name: 'MB', country_id: 1, name: 'Manitoba' },
        { id: 4, short_name: 'NB', country_id: 1, name: 'New Brunswick' },
        { id: 5, short_name: 'NL', country_id: 1, name: 'Newfoundland and Labrador' },
        { id: 6, short_name: 'NT', country_id: 1, name: 'Northwest Territories' },
        { id: 7, short_name: 'NS', country_id: 1, name: 'Nova Scotia' },
        { id: 8, short_name: 'NU', country_id: 1, name: 'Nunavut' },
        { id: 9, short_name: 'ON', country_id: 1, name: 'Ontario' },
        { id: 10, short_name: 'PE', country_id: 1, name: 'Prince Edward Island' },
        { id: 11, short_name: 'QC', country_id: 1, name: 'Quebec' },
        { id: 12, short_name: 'SK', country_id: 1, name: 'Saskatchewan' },
        { id: 13, short_name: 'YT', country_id: 1, name: 'Yukon' },
      ]));
};
