export interface Thana { name: string; }
export interface District { name: string; thanas: string[]; }
export interface Division { name: string; districts: District[]; }

export const BD_LOCATIONS: Division[] = [
    {
        name: "Dhaka",
        districts: [
            { name: "Dhaka", thanas: ["Adabor", "Badda", "Bangshal", "Bimanbandar", "Cantonment", "Chalkbazar", "Demra", "Dhanmondi", "Gendaria", "Gulshan", "Hazaribagh", "Jatrabari", "Kadamtali", "Kafrul", "Kalabagan", "Kamrangirchar", "Khilgaon", "Khilkhet", "Kotwali", "Lalbagh", "Mirpur", "Mohammadpur", "Motijheel", "Mugda", "New Market", "Pallabi", "Paltan", "Ramna", "Rayer Bazar", "Sabujbagh", "Shah Ali", "Shahbagh", "Sher-e-Bangla Nagar", "Shyampur", "Sutrapur", "Tejgaon", "Tejgaon Industrial Area", "Turag", "Uttara", "Uttara West", "Vatara", "Wari"] },
            { name: "Gazipur", thanas: ["Gazipur Sadar", "Kaliakair", "Kaliganj", "Kapasia", "Sreepur", "Tongi"] },
            { name: "Narsingdi", thanas: ["Belabo", "Monohardi", "Narsingdi Sadar", "Palash", "Raipura", "Shibpur"] },
            { name: "Manikganj", thanas: ["Daulatpur", "Ghior", "Harirampur", "Manikganj Sadar", "Saturia", "Shivalaya", "Singair"] },
            { name: "Munshiganj", thanas: ["Gazaria", "Louhajang", "Munshiganj Sadar", "Sirajdikhan", "Sreenagar", "Tongibari"] },
            { name: "Narayanganj", thanas: ["Araihazar", "Bandar", "Narayanganj Sadar", "Rupganj", "Sonargaon"] },
            { name: "Tangail", thanas: ["Basail", "Bhuapur", "Delduar", "Dhanbari", "Ghatail", "Gopalpur", "Kalihati", "Madhupur", "Mirzapur", "Nagarpur", "Sakhipur", "Tangail Sadar"] },
            { name: "Kishoreganj", thanas: ["Austagram", "Bajitpur", "Bhairab", "Hossainpur", "Itna", "Karimganj", "Katiadi", "Kishoreganj Sadar", "Kuliarchar", "Mithamain", "Nikli", "Pakundia", "Tarail"] },
            { name: "Faridpur", thanas: ["Alfadanga", "Bhanga", "Boalmari", "Char Bhadrasan", "Faridpur Sadar", "Madhukhali", "Nagarkanda", "Saltha"] },
            { name: "Gopalganj", thanas: ["Gopalganj Sadar", "Kashiani", "Kotalipara", "Muksudpur", "Tungipara"] },
            { name: "Madaripur", thanas: ["Kalkini", "Madaripur Sadar", "Rajoir", "Shibchar"] },
            { name: "Rajbari", thanas: ["Baliakandi", "Goalandaghat", "Kalukhali", "Pangsha", "Rajbari Sadar"] },
            { name: "Shariatpur", thanas: ["Bhedarganj", "Damudya", "Gosairhat", "Naria", "Shariatpur Sadar", "Zanjira"] },
        ]
    },
    {
        name: "Chittagong",
        districts: [
            { name: "Chittagong", thanas: ["Akbar Shah", "Bakalia", "Bandar", "Bayezid Bostami", "Chandgaon", "Chittagong Port", "Chawkbazar", "Doublemooring", "EPZ", "Halishahar", "Khulshi", "Kotwali", "Pahartali", "Panchlaish", "Patenga", "Sadarghat", "Sholoshahar"] },
            { name: "Cox's Bazar", thanas: ["Chakaria", "Eidgaon", "Kalatali", "Kutubdia", "Maheshkhali", "Mongla", "Pekua", "Raju", "Ramu", "Teknaf", "Ukhia", "Upajilas"] },
            { name: "Comilla", thanas: ["Barura", "Brahmanpara", "Burichong", "Chandina", "Chauddagram", "Comilla Sadar", "Comilla Sadar Dakshin", "Daudkandi", "Debidwar", "Homna", "Laksam", "Lalmai", "Meghna", "Monohorgonj", "Muradnagar", "Nangalkot", "Titas"] },
            { name: "Feni", thanas: ["Chhagalnaiya", "Daganbhuiyan", "Feni Sadar", "Fulgazi", "Parshuram", "Sonagazi"] },
            { name: "Khagrachhari", thanas: ["Dighinala", "Guimara", "Khagrachhari Sadar", "Lakshmichhari", "Mahalchhari", "Manikchhari", "Matiranga", "Panchhari", "Ramgarh"] },
            { name: "Lakshmipur", thanas: ["Kamalnagar", "Lakshmipur Sadar", "Ramgati", "Ramganj", "Raipur"] },
            { name: "Noakhali", thanas: ["Begumganj", "Chatkhil", "Companiganj", "Hatiya", "Kabirhat", "Noakhali Sadar", "Senbagh", "Sonaimuri", "Subarna Char"] },
            { name: "Rangamati", thanas: ["Bagaichhari", "Barkal", "Belaichhari", "Jurai Chhari", "Kaptai", "Kawkhali", "Langadu", "Nananiyarchar", "Rajasthali", "Rangamati Sadar", "Rowangchhari"] },
            { name: "Brahmanbaria", thanas: ["Akhaura", "Ashuganj", "Bancharampur", "Bijoynagar", "Brahmanbaria Sadar", "Kasba", "Nabinagar", "Nasirnagar", "Sarail"] },
            { name: "Chandpur", thanas: ["Chandpur Sadar", "Faridganj", "Haimchar", "Haziganj", "Kachua", "Matlab North", "Matlab South", "Shahrasti"] },
        ]
    },
    {
        name: "Rajshahi",
        districts: [
            { name: "Rajshahi", thanas: ["Bagha", "Bagmara", "Boalia", "Charghat", "Godagari", "Matihar", "Mohanpur", "Paba", "Puthia", "Rajpara", "Shah Makhdum", "Tanore"] },
            { name: "Bogura", thanas: ["Adamdighi", "Bogura Sadar", "Dhunat", "Dupchanchia", "Gabtali", "Kahaloo", "Nandigram", "Sariakandi", "Shajahanpur", "Sherpur", "Shibganj", "Sonatola"] },
            { name: "Chapai Nawabganj", thanas: ["Bholahat", "Chapai Nawabganj Sadar", "Gomastapur", "Nachole", "Shibganj"] },
            { name: "Joypurhat", thanas: ["Akkelpur", "Joypurhat Sadar", "Kalai", "Khetlal", "Panchbibi"] },
            { name: "Naogaon", thanas: ["Atrai", "Badalgachhi", "Dhamoirhat", "Manda", "Mahadebpur", "Mohadevpur", "Naogaon Sadar", "Niamatpur", "Patnitala", "Porsha", "Raninagar", "Sapahar"] },
            { name: "Natore", thanas: ["Bagatipara", "Baraigram", "Gurudaspur", "Lalpur", "Natore Sadar", "Singra"] },
            { name: "Pabna", thanas: ["Atgharia", "Bera", "Bhangura", "Chatmohar", "Faridpur", "Ishwardi", "Pabna Sadar", "Santhia", "Sujanagar"] },
            { name: "Sirajganj", thanas: ["Belkuchi", "Chauhali", "Kamarkhanda", "Kazipur", "Raiganj", "Shahjadpur", "Sirajganj Sadar", "Tarash", "Ullapara"] },
        ]
    },
    {
        name: "Khulna",
        districts: [
            { name: "Khulna", thanas: ["Batiaghata", "Dacope", "Daulatpur", "Dighalia", "Dumuria", "Harintana", "Khan Jahan Ali", "Khulna Sadar", "Koyra", "Paikgachha", "Phultala", "Rupsha", "Sonadanga", "Terokhada"] },
            { name: "Bagerhat", thanas: ["Bagerhat Sadar", "Chitalmari", "Fakirhat", "Kachua", "Mollahat", "Mongla", "Morrelganj", "Rampal", "Sarankhola"] },
            { name: "Chuadanga", thanas: ["Alamdanga", "Chuadanga Sadar", "Damurhuda", "Jibannagar"] },
            { name: "Jessore", thanas: ["Abhaynagar", "Bagherpara", "Chaugachha", "Jhikargachha", "Jessore Sadar", "Keshabpur", "Manirampur", "Sharsha"] },
            { name: "Jhenaidah", thanas: ["Harinakundu", "Jhenaidah Sadar", "Kaliganj", "Kotchandpur", "Maheshpur", "Shailkupa"] },
            { name: "Kushtia", thanas: ["Bheramara", "Daulatpur", "Khoksa", "Kumarkhali", "Kushtia Sadar", "Mirpur"] },
            { name: "Magura", thanas: ["Magura Sadar", "Mohammadpur", "Shalikha", "Sreepur"] },
            { name: "Meherpur", thanas: ["Gangni", "Meherpur Sadar", "Mujibnagar"] },
            { name: "Narail", thanas: ["Kalia", "Lohagara", "Narail Sadar"] },
            { name: "Satkhira", thanas: ["Assasuni", "Debhata", "Kalaroa", "Kaliganj", "Satkhira Sadar", "Shyamnagar", "Tala"] },
        ]
    },
    {
        name: "Sylhet",
        districts: [
            { name: "Sylhet", thanas: ["Balaganj", "Beanibazar", "Bishwanath", "Companiganj", "Dakshin Surma", "Fenchuganj", "Golapganj", "Gowainghat", "Jaintiapur", "Kanaighat", "Osmani Nagar", "Sylhet Sadar", "South Surma", "Zakiganj"] },
            { name: "Habiganj", thanas: ["Ajmiriganj", "Bahubal", "Baniachong", "Chunarughat", "Habiganj Sadar", "Lakhai", "Madhabpur", "Nabiganj"] },
            { name: "Moulvibazar", thanas: ["Barlekha", "Juri", "Kamalganj", "Kulaura", "Moulvibazar Sadar", "Rajnagar", "Sreemangal"] },
            { name: "Sunamganj", thanas: ["Bishwamvarpur", "Chhatak", "Derai", "Dharampasha", "Doerbazar", "Jagannathpur", "Jamalganj", "Sullah", "Sunamganj Sadar", "South Sunamganj", "Tahirpur"] },
        ]
    },
    {
        name: "Barisal",
        districts: [
            { name: "Barisal", thanas: ["Agailjhara", "Babuganj", "Bakerganj", "Banaripara", "Barisal Sadar", "Gournadi", "Hizla", "Mehendiganj", "Muladi", "Uzirpur", "Wazirpur"] },
            { name: "Bhola", thanas: ["Bhola Sadar", "Borhanuddin", "Char Fasson", "Daulatkhan", "Lalmohan", "Manpura", "Tazumuddin"] },
            { name: "Jhalokati", thanas: ["Jhalokati Sadar", "Kathalia", "Nalchity", "Rajapur"] },
            { name: "Patuakhali", thanas: ["Bauphal", "Dashmina", "Dumki", "Galachipa", "Kalapara", "Mirzaganj", "Patuakhali Sadar", "Rangabali"] },
            { name: "Pirojpur", thanas: ["Bhandaria", "Kawkhali", "Mathbaria", "Nazirpur", "Pirojpur Sadar", "Nesarabad", "Zianagar"] },
            { name: "Barguna", thanas: ["Amtali", "Bamna", "Barguna Sadar", "Betagi", "Pathorghata", "Taltali"] },
        ]
    },
    {
        name: "Rangpur",
        districts: [
            { name: "Rangpur", thanas: ["Badarganj", "Gangachhara", "Kaunia", "Mithapukur", "Pirgachha", "Pirganj", "Rangpur Sadar", "Taraganj"] },
            { name: "Dinajpur", thanas: ["Birampur", "Birganj", "Bochaganj", "Chirirbandar", "Dinajpur Sadar", "Fulbari", "Ghoraghat", "Hakimpur", "Kaharole", "Khansama", "Nawabganj", "Parbatipur"] },
            { name: "Gaibandha", thanas: ["Fulchhari", "Gaibandha Sadar", "Gobindaganj", "Palashbari", "Sadullapur", "Saghata", "Sundarganj"] },
            { name: "Kurigram", thanas: ["Bhurungamari", "Char Rajibpur", "Chilmari", "Kurigram Sadar", "Nageshwari", "Phulbari", "Rajarhat", "Raomari", "Ulipur"] },
            { name: "Lalmonirhat", thanas: ["Aditmari", "Hatibandha", "Kaliganj", "Lalmonirhat Sadar", "Patgram"] },
            { name: "Nilphamari", thanas: ["Dimla", "Domar", "Jaldhaka", "Kishoreganj", "Nilphamari Sadar", "Saidpur"] },
            { name: "Panchagarh", thanas: ["Atwari", "Boda", "Debiganj", "Panchagarh Sadar", "Tetulia"] },
            { name: "Thakurgaon", thanas: ["Baliadangi", "Haripur", "Pirganj", "Ranisankail", "Thakurgaon Sadar"] },
        ]
    },
    {
        name: "Mymensingh",
        districts: [
            { name: "Mymensingh", thanas: ["Bhaluka", "Dhobaura", "Fulbaria", "Gaffargaon", "Gauripur", "Haluaghat", "Ishwarganj", "Muktagachha", "Mymensingh Sadar", "Nandail", "Phulpur", "Trishal"] },
            { name: "Jamalpur", thanas: ["Bakshiganj", "Dewanganj", "Islampur", "Jamalpur Sadar", "Madarganj", "Melandaha", "Sarishabari"] },
            { name: "Netrokona", thanas: ["Atpara", "Barhatta", "Durgapur", "Kalmakanda", "Kendua", "Khaliajuri", "Madan", "Mohanganj", "Netrokona Sadar", "Purbadhala"] },
            { name: "Sherpur", thanas: ["Jhenaigati", "Nakla", "Nalitabari", "Sherpur Sadar", "Sreebardi"] },
        ]
    },
];

export function getDivisions(): string[] {
    return BD_LOCATIONS.map(d => d.name);
}

export function getDistricts(division: string): string[] {
    return BD_LOCATIONS.find(d => d.name === division)?.districts.map(d => d.name) || [];
}

export function getThanas(division: string, district: string): string[] {
    return BD_LOCATIONS.find(d => d.name === division)
        ?.districts.find(d => d.name === district)
        ?.thanas || [];
}

export function buildAddress(division: string, district: string, thana: string, area: string): string {
    const parts = [area, thana, district, division].filter(Boolean);
    return parts.join(", ");
}

export function parseAddress(address: string) {
    if (!address) return { division: "", district: "", thana: "", area: "" };
    const parts = address.split(", ").map(p => p.trim());

    // Pattern: [Area], [Thana], [District], [Division]
    // Since parts can vary (if area is empty), we work backwards from known lists
    const divisions = getDivisions();

    const division = parts.find(p => divisions.includes(p)) || "";
    const districts = division ? getDistricts(division) : [];
    const district = parts.find(p => districts.includes(p)) || "";
    const thanas = district ? getThanas(division, district) : [];
    const thana = parts.find(p => thanas.includes(p)) || "";

    // Everything else that isn't division, district or thana is considered area
    const area = parts.filter(p => p !== division && p !== district && p !== thana).join(", ");

    return { division, district, thana, area };
}
