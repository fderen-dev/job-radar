const cherio = require('cherio');
const axios = require('axios');

const url = 'https://www.masterborn.com/career';

interface JobSelector {
    title: string;
}

async function getJobs(url: string, jobSelector: JobSelector) {
    const { data } = await axios.get(url);
    const $ = cherio.load(data);
    const jobs = $(jobSelector.title)
      .map((_: number, element: any) => {
        const title = $(element).text();
        return { title };
      })
      .get();
    return jobs;
}

async function main() {
    const jobs = await getJobs(url, {
        title: '.positions h3',
    });
    console.log(jobs);
}

main();