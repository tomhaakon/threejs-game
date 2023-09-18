import supabase from "@supabase/supabase-js";

const { error } = await supabase
  .from("countries")
  .insert({ id: 1, name: "Denmark" });
