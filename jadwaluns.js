var csrf = document.querySelector("input[name=_csrf-frontend]").value

var csrfToken = "";

var listFakultas = await getAllFakultas();
var listProdi = await getAllProdi(listFakultas);

console.log(listProdi)

async function getAllFakultas() {
  const list = {};

  const res = await fetch("https://jadwal.uns.ac.id/jadwal/kelas", {
    credential: "include"
  });
  const text = await res.text();
  const parser = new DOMParser();
  
  const dom = parser.parseFromString(text, "text/html");
  const csrfInput = dom.querySelector("input[name=_csrf-frontend]");
  
  csrfToken = csrfInput.value;
  
  let options = dom.querySelectorAll("select#fakultas-idfakultas option")
	options = [...options].slice(1).forEach(opt => {
    const fakultas = opt
      .innerText
      .toLowerCase()
    	.split(" ")
    	.map(word => word[0].toUpperCase() + word.substring(1))
    	.join("");
		list[fakultas] = []
  })
  return list
}


async function getAllProdi(list){
  const listLength = Object.keys(list).length
  
  for (let i = 1; i <= listLength; i += 1){
    const formData = new URLSearchParams({
      "depdrop_parents[0]": i,
      "depdrop_all_params[fakultas-idfakultas]": i,
    });

    const res = await fetch("https://jadwal.uns.ac.id/dosen/listprodi", {
      method: "POST",
      body: formData,
      headers: {
        "X-CSRF-Token": csrfToken,
        "X-Requested-With": "XMLHttpRequest",
      },
    })

    const json = await res.json()
    const iKey = Object.keys(list)[i - 1]
    list[iKey] = json.output
  }
  return list
}
