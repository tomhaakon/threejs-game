import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_PUBLIC_ANON_KEY";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// //interact
// let { data, error } = await supabase
//   .from("YOUR_TABLE_NAME")
//   .insert([{ column1: "value1", column2: "value2" }]);

// //fetch data
// let { data, error } = await supabase.from("YOUR_TABLE_NAME").select("*");

// //update
// let { data, error } = await supabase
//   .from("YOUR_TABLE_NAME")
//   .update({ column1: "new_value" })
//   .eq("id", someId);

// //delete
// let { data, error } = await supabase
//   .from("YOUR_TABLE_NAME")
//   .delete()
//   .eq("id", someId);
